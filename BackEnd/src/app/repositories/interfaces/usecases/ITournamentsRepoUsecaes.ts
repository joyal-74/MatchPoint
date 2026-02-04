import { LiveMatchCardDTO } from "../../../../domain/dtos/LiveMatchDTO.js";
import { Match } from "../../../../domain/entities/Match.js";
import { PointsRow, PointsTableResponse } from "../../../../domain/entities/PointsTable.js";
import { Leaderboard, Tournament } from "../../../../domain/entities/Tournaments.js";

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
    execute(tournamentId: string): Promise<Leaderboard>;
}

export interface IStartTournament {
    execute(tournamentId: string): Promise<void>;
}

export interface IGetPointsTableUseCase {
    execute(tournamentId: string):Promise<PointsTableResponse>;
}
