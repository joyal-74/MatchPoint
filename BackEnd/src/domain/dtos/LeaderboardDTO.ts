import type { LeaderBoardPlayer } from "../../domain/entities/Player.js";

export interface LeaderboardDTO {
    topPlayers: LeaderBoardPlayer[];
    leaderboard: LeaderBoardPlayer[];
}
