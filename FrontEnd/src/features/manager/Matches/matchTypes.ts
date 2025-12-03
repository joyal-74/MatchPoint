export interface Player {
    _id: string;
    name: string;
    role: string;
    status: string;
    profileImage?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    stats: Record<string, any>;
}

export interface Team {
    id: string;
    name: string;
    members: Player[];
    logo?: string;
}

export type MatchStatus = "upcoming" | "live" | "completed";

export interface Match {
    _id: string;
    tournamentId: string;
    matchNumber: string;
    round: number;
    date: string;
    venue: string;
    tossWinner: string | null;
    tossDecision: string | null;
    status: MatchStatus;
    winner: string;
    teamA: Team;
    teamB: Team;
    stats?: Record<string, any>;
    overs?: number;
}
