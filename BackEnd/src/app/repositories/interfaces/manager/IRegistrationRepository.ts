import { Registration } from "domain/entities/Registration";
import { TournamentTeam } from "domain/entities/Tournaments";

export interface IRegistrationRepository {
    create(registration: Omit<Registration, '_id' | 'createdAt' | 'updatedAt'>): Promise<Registration>;
    getTeamsByTournament(tournamentId: string,): Promise<TournamentTeam[]>;
    findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null>;
    updatePaymentStatus(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Registration>;
    findByPaymentId(paymentId: string): Promise<Registration | null>;
}