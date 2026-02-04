
import mongoose, { FilterQuery } from "mongoose";
import { Tournament, TournamentRegister, TournamentTeam } from "../../../domain/entities/Tournaments.js";
import { ITournamentRepository } from "../../../app/repositories/interfaces/shared/ITournamentRepository.js";
import { TournamentModel } from "../../databases/mongo/models/TournamentModel.js";
import { TournamentMongoMapper } from "../../utils/mappers/TournamentMongoMapper.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";
import { FormatStatPoint, TopTournamentPoint } from "../../../domain/dtos/Analytics.dto.js";

interface QueryType {
    status?: string;
    isBlocked?: boolean;
}

export class TournamentRepositoryMongo implements ITournamentRepository {
    async create(tournamentData: TournamentRegister): Promise<Tournament> {
        const created = new TournamentModel(tournamentData);
        await created.save();
        return TournamentMongoMapper.toDomain(created);
    }

    async findAll(managerId: string): Promise<Tournament[]> {
        const tournaments = await TournamentModel.find({ managerId, status: { $ne: 'cancelled' } }).populate("managerId", "firstName lastName email phone");
        return TournamentMongoMapper.toDomainArray(tournaments);
    }

    async findById(id: string): Promise<Tournament | null> {
        const tournament = await TournamentModel.findById(id).populate("managerId", "firstName lastName email phone");
        if (!tournament) return null;
        return TournamentMongoMapper.toDomain(tournament);
    }

    async getByManager(managerId: string): Promise<Tournament[] | null> {
        const tournaments = await TournamentModel.find({ managerId, status: { $ne: 'cancelled' } }).populate("managerId", "firstName lastName email phone");
        return TournamentMongoMapper.toDomainArray(tournaments) ?? null;
    }

    async getExploreTournaments(managerId: string, page: number = 1, limit: number = 15, search?: string, filter?: string): Promise<Tournament[] | null> {
        const query: FilterQuery<Tournament> = {};

        query.managerId = { $ne: managerId };

        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { title: regex },
                { sport: regex },
                { location: regex }
            ];
        }

        if (!filter || filter === "all") {
            query.status = { $ne: "cancelled" };
        } else {
            query.status = filter;
        }

        const skip = (page - 1) * limit;

        const data = await TournamentModel.find(query)
            .populate("managerId", "firstName lastName email phone")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return TournamentMongoMapper.toDomainArray(data);
    }

    async update(tournamentId: string, updates: Partial<Tournament>): Promise<Tournament> {
        const updated = await TournamentModel.findByIdAndUpdate(
            tournamentId,
            { $set: updates },
            { new: true }
        ).populate("managerId", "firstName lastName email phone");
        return TournamentMongoMapper.toDomain(updated!);
    }

    async cancel(tournamentId: string, reason: string): Promise<Tournament> {
        const tournament = await TournamentModel.findOneAndUpdate(
            { _id: tournamentId, status: { $nin: ['ended', 'cancelled'] } },
            {
                $set: {
                    status: 'cancelled',
                    canceled: {
                        isCanceled: true,
                        reason,
                        canceledAt: new Date()
                    }
                }
            },
            { new: true }
        ).populate("managerId", "firstName lastName email phone");

        if (!tournament) {
            throw new BadRequestError("Cannot cancel a tournament that has ended or does not exist");
        }

        return TournamentMongoMapper.toDomain(tournament);
    }

    async updateTeams(tournamentId: string, teams: TournamentTeam[]): Promise<Tournament> {
        const updated = await TournamentModel.findByIdAndUpdate(
            tournamentId,
            { $set: { teams } },
            { new: true }
        );
        return TournamentMongoMapper.toDomain(updated!);
    }

    async incrementCurrTeams(tournamentId: string): Promise<boolean> {
        const updated = await TournamentModel.findByIdAndUpdate(tournamentId, {
            $inc: { currTeams: 1 }
        });
        if (!updated) throw new NotFoundError("Tournament not found for currTeams increment");

        return true
    }

    async findByFilters({ status, isBlocked, page, limit }: { status?: string; isBlocked?: boolean; page: number; limit: number; }): Promise<{ tournaments: Tournament[]; total: number }> {

        const query: QueryType = {};
        if (status) query.status = status;
        if (typeof isBlocked === "boolean") {
            query.isBlocked = isBlocked;
        }
        console.log(query)

        const tournaments = await TournamentModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await TournamentModel.countDocuments(query);

        const tournamentData = TournamentMongoMapper.toDomainArray(tournaments);

        return { tournaments: tournamentData, total };
    }

    async findManyByIds(ids: string[], page: number, limit: number): Promise<{ tournaments: Tournament[]; total: number }> {

        const skip = (page - 1) * limit;

        const total = await TournamentModel.countDocuments({ _id: { $in: ids } });

        const tournaments = await TournamentModel.find({ _id: { $in: ids } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const tournamentData = TournamentMongoMapper.toDomainArray(tournaments);

        return { tournaments: tournamentData, total };
    }

    async findByManagerId(managerId: string): Promise<Tournament[]> {
        const tournaments = await TournamentModel.find({ managerId })
        return TournamentMongoMapper.toDomainArray(tournaments);
    }

    async getFormatDistribution(managerId: string): Promise<FormatStatPoint[]> {
        return TournamentModel.aggregate([
            { $match: { managerId: new mongoose.Types.ObjectId(managerId) } },
            { $group: { _id: "$format", value: { $count: {} } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);
    }

    async getTopPerforming(managerId: string, limit: number): Promise<TopTournamentPoint[]> {
        return TournamentModel.aggregate([
            { $match: { managerId: new mongoose.Types.ObjectId(managerId) } },
            {
                $project: {
                    title: 1,
                    status: 1,
                    currTeams: 1,
                    maxTeams: 1,
                    // Calculate Volume dynamically
                    volume: {
                        $multiply: [
                            { $toDouble: "$entryFee" },
                            { $toInt: "$currTeams" }
                        ]
                    }
                }
            },
            { $sort: { volume: -1 } },
            { $limit: limit }
        ]);
    }

    async getIdsByManager(managerId: string): Promise<string[]> {
        const objectId = new mongoose.Types.ObjectId(managerId);
        const docs = await TournamentModel.find({ managerId: objectId }).select('_id');
        return docs.map(d => d._id.toString());
    }
}
