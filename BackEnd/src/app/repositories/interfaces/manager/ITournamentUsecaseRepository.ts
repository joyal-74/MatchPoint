import { ITournamentsResponse, Tournament } from "domain/entities/Tournaments";

export interface IGetAllTournaments {
    execute(managerId: string): Promise<ITournamentsResponse>;
}

export interface IAddTournament {
    execute(data : Tournament) : Promise<ITournamentsResponse>;
}

export interface IEditTournament {
    execute(data : Partial<Tournament>) : Promise<Tournament>;
}

export interface IGetTournamentById {
    execute(tournamentId: string): Promise<Tournament>;
}

export interface IExploreTournaments {
    execute(filters?: Partial<Tournament>): Promise<Tournament[]>;
}
