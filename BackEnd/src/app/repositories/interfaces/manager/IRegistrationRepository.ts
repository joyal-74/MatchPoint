import { TournamentTeamData } from "domain/dtos/Tournament";
import { Registration } from "domain/entities/Registration";

export interface IRegistrationRepository {
    create(registration: Omit<Registration, '_id' | 'createdAt' | 'updatedAt'>): Promise<TournamentTeamData>;
    getTeamsByTournament(tournamentId: string,): Promise<TournamentTeamData[]>;
    findTeamIdsByTournament(tournamentId: string);
    findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null>;
    updatePaymentStatus(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<TournamentTeamData>;
    findByPaymentId(paymentId: string): Promise<Registration | null>;
    findByTeamIds(teamIds: string[]): Promise<Registration[] | null>;
}