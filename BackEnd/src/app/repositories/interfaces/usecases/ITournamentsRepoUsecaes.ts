import { Leaderboard, Tournament } from "domain/entities/Tournaments";

export interface IGetPlayerTournaments {
    execute(status: string, page: number, limit: number, playerId?: string): Promise<{ tournaments: Tournament[]; total: number }>
}


export interface IGetTourLeaderboard {
    execute(tournamentId: string): Promise<Leaderboard>;
}