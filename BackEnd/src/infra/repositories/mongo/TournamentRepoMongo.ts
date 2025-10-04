import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { TournamentRegister, Tournament } from "domain/entities/Tournaments";
import { BadRequestError } from "domain/errors";
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

    async getExploreTournaments(filters?: Partial<Tournament>): Promise<Tournament[] | null> {
        const query: FilterQuery<Tournament> = { status: { $ne: 'cancelled' } };

        if (filters?.managerId) {
            query.managerId = { $ne: filters.managerId };
        }

        const data = await TournamentModel.find(query).populate("managerId", "first_name last_name email phone");

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
            throw new BadRequestError("Cannot cancel a tournament that has ended or is already cancelled");
        }

        return TournamentMongoMapper.toDomain(tournament);
    }
}