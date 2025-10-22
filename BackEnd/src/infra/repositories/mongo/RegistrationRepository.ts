import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { TournamentTeamData } from "domain/dtos/Tournament";
import { Registration } from "domain/entities/Registration";
import { NotFoundError } from "domain/errors";
import { RegistrationModel } from "infra/databases/mongo/models/RegistrationModel";
import { TournamentTeamMongoMapper } from "infra/utils/mappers/TournamentTeamMongoMapper";

export class RegistrationRepository implements IRegistrationRepository {
    async create(registration: Omit<Registration, '_id' | 'createdAt' | 'updatedAt'>): Promise<TournamentTeamData> {
        const team = await RegistrationModel.create(registration);
        return TournamentTeamMongoMapper.toDomain(team);
    }

    async findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null> {
        return await RegistrationModel.findOne({ tournamentId, teamId });
    }

    async getTeamsByTournament(tournamentId: string): Promise<TournamentTeamData[]> {
        const teams = await RegistrationModel.find({ tournamentId })
            .populate("teamId")
            .populate("captainId")
            .lean();

        return TournamentTeamMongoMapper.toDomainArray(teams);
    }

    async updatePaymentStatus(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<TournamentTeamData> {
        const registration = await RegistrationModel.findByIdAndUpdate(
            registrationId,
            { paymentStatus, paymentId, updatedAt: new Date() },
            { new: true }
        );
        if (!registration) throw new NotFoundError('Registration not found');
        return TournamentTeamMongoMapper.toDomain(registration);
    }

    async findByPaymentId(paymentId: string): Promise<Registration | null> {
        return await RegistrationModel.findOne({ paymentId });
    }
}