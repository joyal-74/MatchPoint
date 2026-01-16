import { LiveMatchCardDTO } from "domain/dtos/LiveMatchDTO";
import { PointsTableResponse } from "domain/entities/PointsTable";
import { Leaderboard, Tournament } from "domain/entities/Tournaments";

export interface IGetPlayerTournaments {
    execute(status: string, page: number, limit: number, playerId?: string): Promise<{ tournaments: Tournament[]; total: number }>
}

export interface IGetPlayerMatches {
    execute(status: string, page: number, limit: number): Promise<LiveMatchCardDTO[]>
}

export interface IGetTourLeaderboard {
    execute(tournamentId: string): Promise<Leaderboard>;
}

export interface IStartTournament {
    execute(tournamentId: string): Promise<void>;
}

export interface IGetPointsTableUseCase {
    execute(tournamentId: string):Promise<PointsTableResponse>;
}