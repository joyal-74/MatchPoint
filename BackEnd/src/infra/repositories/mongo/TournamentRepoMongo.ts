import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { TournamentRegister, Tournament, TournamentTeam } from "domain/entities/Tournaments";
import { BadRequestError, NotFoundError } from "domain/errors";
import { TournamentModel } from "infra/databases/mongo/models/TournamentModel";
import { TournamentMongoMapper } from "infra/utils/mappers/TournamentMongoMapper";
import { FilterQuery } from "mongoose";

export class TournamentRepositoryMongo implements ITournamentRepository {
    async create(tournamentData: TournamentRegister): Promise<Tournament> {
        const created = new TournamentModel(tournamentData);
        await created.save();
        return TournamentMongoMapper.toDomain(created);
    }

    async findAll(managerId: string): Promise<Tournament[]> {
        const tournaments = await TournamentModel.find({ managerId, status: { $ne: 'cancelled' } }).populate("managerId", "first_name last_name email phone");
        return TournamentMongoMapper.toDomainArray(tournaments);
    }

    async findById(id: string): Promise<Tournament | null> {
        const tournament = await TournamentModel.findById(id).populate("managerId", "first_name last_name email phone");
        if (!tournament) return null;
        return TournamentMongoMapper.toDomain(tournament);
    }

    async getByManager(managerId: string): Promise<Tournament[] | null> {
        const tournaments = await TournamentModel.find({ managerId, status: { $ne: 'cancelled' } }).populate("managerId", "first_name last_name email phone");
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
            .populate("managerId", "first_name last_name email phone")
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
        ).populate("managerId", "first_name last_name email phone");
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
        ).populate("managerId", "first_name last_name email phone");

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
}