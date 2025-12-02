export interface Player {
    _id: string;
    name: string;
    role: string;
    battingStyle?: string;
    bowlingStyle?: string;
    stats?: Record<string, any>;
}

export interface Team {
    _id: string;
    teamName: string;
    players: Player[];
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
    status: MatchStatus;
    winner: string;
    teamA: Team;
    teamB: Team;
    stats?: Record<string, any>;
}
