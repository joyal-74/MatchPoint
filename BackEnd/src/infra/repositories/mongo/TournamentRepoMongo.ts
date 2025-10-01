import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { TournamentRegister, Tournament } from "domain/entities/Tournaments";
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
        const tournaments = await TournamentModel.find({ managerId }).lean();
        return TournamentMongoMapper.toDomainArray(tournaments);
    }

    async findById(id: string): Promise<Tournament | null> {
        const tournament = await TournamentModel.findById(id).lean();
        return tournament as Tournament | null;
    }

    async getByManager(managerId: string): Promise<Tournament[] | null> {
        const tournaments = await TournamentModel.find({ managerId }).lean();
        return (tournaments?.length ? tournaments : null) as Tournament[] | null;
    }

    async getExploreTournaments(filters?: Partial<Tournament>): Promise<Tournament[] | null> {
        const query: FilterQuery<Tournament> = {};

        if (filters?.managerId) {
            query.managerId = { $ne: filters.managerId };
        }

        const data = await TournamentModel.find(query).lean();

        return TournamentMongoMapper.toDomainArray(data);
    }

    async update(tournamentId: string, updates: Partial<Tournament>): Promise<Tournament> {
        const updated = await TournamentModel.findByIdAndUpdate(
            tournamentId,
            { $set: updates },
            { new: true, lean: true }
        );
        return TournamentMongoMapper.toDomain(updated!);
    }
}