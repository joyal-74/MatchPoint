import { TrafficPoint } from "domain/dtos/Analytics.dto";
import { TournamentTeamData } from "domain/dtos/Tournament";
import { Registration } from "domain/entities/Registration";

export interface IRegistrationRepository {
    create(registration: Omit<Registration, '_id' | 'createdAt' | 'updatedAt'>, ctx?: unknown): Promise<Registration>;
    getTeamsByTournament(tournamentId: string,): Promise<TournamentTeamData[]>;
    findTeamIdsByTournament(tournamentId: string) : Promise<string[]>;
    findByTournamentAndTeam(tournamentId: string, teamId: string): Promise<Registration | null>;
    updatePaymentStatus(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Registration>;
    findByPaymentId(paymentId: string): Promise<Registration | null>;
    findByTeamIds(teamIds: string[]): Promise<Registration[] | null>;
    getPaidRegistrationsByTournament(tournamentId: string): Promise<Registration[]>;
    getDailyRegistrations(tournamentIds: string[], days: number): Promise<TrafficPoint[]>;
}