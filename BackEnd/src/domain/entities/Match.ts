import { MatchStatus } from "./Fixture.js";

export interface Match {
    _id: string;
    tournamentId: string;
    teamA: string;
    teamB: string;
    teamLogoA: string,
    teamLogoB: string,
    round: number;
    matchNumber: number;
    status: MatchStatus;
    venue?: string;
    date?: Date;
    winner: string | null;
    stats: Record<string, string>;
    streamTitle: string;
    streamDescription: string;
    isStreamLive: boolean;
    streamStartedAt: string;
    streamerId: string;
}

export interface TeamEntity {
    _id: string;
    name: string;
    logo: string;
    members: any[];
}

export interface MatchDetails {
    _id: string;
    tournamentId: string;
    teamA: TeamEntity;
    teamB: TeamEntity;
    round: number;
    date: string;
    venue: string;
    status: "upcoming" | "live" | "completed";
    matchNumber: string;
    winner: string | null;
    tossWinner: string | null;
    tossDecision: string | null;
    stats: Record<string, any>;
}

export interface TeamResultSummary {
    teamId: string;
    name: string;
    logo?: string;
    runs: number;
    wickets: number;
    overs: string;
    isWinner: boolean;
}

export interface TournamentResult {
    matchId: string;
    matchNumber?: number;
    round?: string;
    date: string | Date;
    venue: string;
    teamA: TeamResultSummary;
    teamB: TeamResultSummary;
    resultMessage: string;
}
