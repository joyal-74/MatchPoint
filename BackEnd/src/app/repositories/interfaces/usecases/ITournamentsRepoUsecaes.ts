import { LiveMatchCardDTO } from "domain/dtos/LiveMatchDTO";
import { Match } from "domain/entities/Match";
import { PointsTableResponse } from "domain/entities/PointsTable";
import { Leaderboard, PointsRow, Tournament } from "domain/entities/Tournaments";

export interface IGetPlayerTournaments {
    execute(status: string, page: number, limit: number, playerId?: string): Promise<{ tournaments: Tournament[]; total: number }>
}

export interface IGetViewerTournaments {
    execute(status: string, page: number, limit: number): Promise<{ tournaments: Tournament[]; total: number }>
}

export interface IGetPlayerMatches {
    execute(status: string, page: number, limit: number): Promise<LiveMatchCardDTO[]>
}

export interface IGetPlayerTournamentMatches {
    execute(tournamentId: string): Promise<Match[]>
}

export interface IGetTourLeaderboard {
    execute(tournamentId: string): Promise<Leaderboard>;
}

export interface IGetTournamentPointsTable {
    execute(tournamentId: string): Promise<PointsRow[]>;
}

export interface IGetTournamentStats {
    execute(tournamentId: string): Promise<string[]>;
}

export interface IStartTournament {
    execute(tournamentId: string): Promise<void>;
}

export interface IGetPointsTableUseCase {
    execute(tournamentId: string):Promise<PointsTableResponse>;
}