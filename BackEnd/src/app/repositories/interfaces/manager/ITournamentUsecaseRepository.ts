import { Tournament } from "domain/entities/Tournaments";

export interface IGetMyTournaments {
    execute(managerId: string): Promise<Tournament[]>;
}

export interface IGetExploreTournaments {
    execute(managerId: string): Promise<Tournament[]>;
}

export interface IAddTournament {
    execute(data : Tournament) : Promise<Tournament>;
}

export interface IEditTournament {
    execute(data : Partial<Tournament>) : Promise<Tournament>;
}

export interface IDeleteTournament {
    execute(tournamentId: string) : Promise<string>;
}

export interface IGetTournamentById {
    execute(tournamentId: string): Promise<Tournament>;
}