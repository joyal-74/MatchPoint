import { MatchStatus } from "./Fixture";

export interface Match {
    _id: string;
    tournamentId: string;
    teamA: string;
    teamB: string;
    teamLogoA : string,
    teamLogoB : string,
    round: number;
    matchNumber: number;
    status: MatchStatus;
    venue?: string;
    date?: Date;
    winner: string | null;
    stats: Record<string, string>
}

export interface TeamEntity {
    id: string;
    name: string;
    logo: string;
    members: any[];
}

export interface MatchEntity {
    id: string;
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