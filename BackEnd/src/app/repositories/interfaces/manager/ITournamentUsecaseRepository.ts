import { TournamentTeamData } from "domain/dtos/Tournament";
import { Fixture } from "domain/entities/Fixture";
import { Tournament } from "domain/entities/Tournaments";

export interface IGetMyTournaments {
    execute(managerId: string): Promise<Tournament[]>;
}

export interface IGetExploreTournaments {
    execute(managerId: string, page: number, limit: number, search: string, filter: string): Promise<Tournament[]>;
}

export interface IAddTournament {
    execute(data: Tournament): Promise<Tournament>;
}

export interface IEditTournament {
    execute(data: Partial<Tournament>): Promise<Tournament>;
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
    execute(tournamentId: string, teamId: string, captainId: string, managerId: string, paymentMethod: string): Promise<{ tournament: Tournament; paymentUrl: string; paymentSessionId: string; registrationId: string, orderId?: string, keyId?: string }>;
}

export interface IUpdateTournamentTeam {
    execute(registrationId: string, paymentStatus: 'completed' | 'failed', paymentId: string): Promise<Tournament>;
}

export interface IGetRegisteredTeams {
    execute(tournamentId: string): Promise<TournamentTeamData[]>;
}


export interface IGetTournamentFixtures {
    execute(tournamentId: string): Promise<Fixture>;
}

export interface ICreateTournamentFixtures {
    execute(tournamentId: string, data: Fixture): Promise<Fixture>;
}

export interface ITournamentRegistrationValidator {
    execute(tournamentId: string, teamId: string): Promise<void>;
}
