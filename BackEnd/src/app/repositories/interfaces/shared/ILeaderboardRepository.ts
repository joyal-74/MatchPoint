import { LeaderBoardPlayer } from "domain/entities/Player";

export interface ILeaderboardRepository {
    getLeaderboard(
        role: string,
        search: string,
        timePeriod: string,
        page: number,
        limit: number
    ): Promise<{ topPlayers: LeaderBoardPlayer[]; leaderboard: LeaderBoardPlayer[] }>;
}
