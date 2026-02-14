import { LeaderBoardPlayer } from "../../../../domain/entities/Player.js";
import { Leaderboard } from "../../../../domain/entities/Tournaments.js";

export interface ILeaderboardRepository {
    getLeaderboard(
        role: string,
        search: string,
        timePeriod: string,
        page: number,
        limit: number
    ): Promise<{ topPlayers: LeaderBoardPlayer[]; leaderboard: LeaderBoardPlayer[] }>;

    getTournamentLeaderboard(tournamentId: string): Promise<Leaderboard>;
}