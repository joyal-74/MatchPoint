import { IRegistrationRepository } from "app/repositories/interfaces/manager/IRegistrationRepository";
import { Registration } from "domain/entities/Registration";
import { TournamentTeam } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";
import { RegistrationModel } from "infra/databases/mongo/models/RegistrationModel";

export class RegistrationRepository implements IRegistrationRepository {
    async create(registration: Omit<Registration, '_id' | 'createdAt' | 'updatedAt'>): Promise<Registration> {
        return RegistrationModel.create(registration);
    }

    async findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null> {
        return RegistrationModel.findOne({ tournamentId, teamId });
    }

    async getTeamsByTournament(tournamentId: string): Promise<TournamentTeam[]> {
        const teams = await RegistrationModel.find({ tournamentId })
            .populate("teamId")
            .populate("captainId")
            .lean();

        return teams
    }

    async updatePaymentStatus(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Registration> {
        const registration = await RegistrationModel.findByIdAndUpdate(
            registrationId,
            { paymentStatus, paymentId, updatedAt: new Date() },
            { new: true }
        );
        if (!registration) throw new NotFoundError('Registration not found');
        return registration;
    }

    async findByPaymentId(paymentId: string): Promise<Registration | null> {
        return RegistrationModel.findOne({ paymentId });
    }
}