import { MatchStatus } from "./Fixture";

export interface Match {
    _id: string;
    tournamentId: string;
    teamA: string;
    teamB: string;
    round: number;
    matchNumber: number;
    status: MatchStatus;
    venue?: string;
    date?: Date;
    winner: string;
    stats: Record<string, string>
}