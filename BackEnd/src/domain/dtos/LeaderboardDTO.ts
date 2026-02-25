import type { LeaderBoardPlayer } from "../../domain/entities/Player";

export interface LeaderboardDTO {
    topPlayers: LeaderBoardPlayer[];
    leaderboard: LeaderBoardPlayer[];
}
