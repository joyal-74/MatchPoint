import { Tournament } from "domain/entities/Tournaments";

export interface IGetMyTournaments {
    execute(managerId: string): Promise<Tournament[]>;
}

export interface IGetExploreTournaments {
    execute(managerId : string, page : number, limit : number, search : string, filter : string): Promise<Tournament[]>;
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