import { TournamentTeamData } from "domain/dtos/Tournament";
import { Fixture } from "domain/entities/Fixture";
import { Match } from "domain/entities/Match";
import { Tournament } from "domain/entities/Tournaments";
import type { File } from "domain/entities/File";
import { DashboardAnalyticsDTO } from "domain/dtos/Analytics.dto";


export interface IGetMyTournaments {
    execute(managerId: string): Promise<Tournament[]>;
}

export interface IGetExploreTournaments {
    execute(managerId: string, page: number, limit: number, search: string, filter: string): Promise<Tournament[]>;
}

export interface IAddTournament {
    execute(data: Tournament, file?: File): Promise<Tournament>;
}

export interface IEditTournament {
    execute(data: Partial<Tournament>, file?: File): Promise<Tournament>;
}

export interface ICancelTournament {
    execute(tournamentId: string, reason: string): Promise<string>;
}

export interface IGetTournamentById {
    execute(tournamentId: string): Promise<Tournament>;
}

export interface IGetTournamentDetails {
    execute(tournamentId: string): Promise<Tournament>;
}


export interface PaymentUrls {
    success: string;
    cancel: string;
}

export interface IInitiateTournamentPayment {
    execute(tournamentId: string, teamId: string, captainId: string, managerId: string, paymentMethod: string);
}

export interface IUpdateTournamentTeam {
    execute(userId: string, registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Tournament>;
}

export interface IGetRegisteredTeams {
    execute(tournamentId: string): Promise<TournamentTeamData[]>;
}


export interface IGetTournamentFixtures {
    execute(tournamentId: string): Promise<Fixture>;
}

export interface IGetTournamentMatches {
    execute(tournamentId: string): Promise<Match[]>;
}

export interface ICreateTournamentFixtures {
    execute(tournamentId: string, matchIds: { matchId: string; round: number }[], format: string): Promise<Fixture>;
}


export interface ICreateMatchesUseCase {
    execute(tournamentId: string, matchesData: Match[]): Promise<Match[]>;
}

export interface ITournamentRegistrationValidator {
    execute(tournamentId: string, teamId: string): Promise<void>;
}

export interface IGetDashboardAnalytics {
    execute(managerId: string): Promise<DashboardAnalyticsDTO>
}
