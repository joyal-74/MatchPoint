export type TeamStatus = "active" | "blocked" | "deleted";
export type PhaseStatus = "recruiting" | "active" | "competing" | "completed" | "inactive";
export type playerStatus = "playing" | "substitute";

export type statsType = {
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
}
