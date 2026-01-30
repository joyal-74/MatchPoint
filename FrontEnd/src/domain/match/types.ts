export type TeamId = string;
export type TossDecision = "Batting" | "Bowling" | null;

export interface BattingStats {
    matches: number;
    out: string;
    balls: string;
    playerId: string;
    innings: number;
    runs: number;
    average: number;
    strikeRate: number;
    hundreds: number;
    fifties: number;
    fours: number;
    sixes: number;
    highestScore: number;
}

export interface BowlingStats {
    playerId: string;
    matches: number;
    ballsBowled: number;
    runsConceded: number;
    wickets: number;
    average: number;
    economy: number;
    strikeRate: number;
    fiveWicketHauls: number;
    tenWicketHauls: number;
    bestFigures: number;
}

export interface FieldingStats {
    catches: number;
    stumpings: number;
    runOuts: number;
}

export interface GeneralStats {
    manOfTheMatch: number;
    manOfTheSeries: number;
}

export interface PlayerStats {
    batting: BattingStats;
    bowling: BowlingStats;
    fielding: FieldingStats;
    general: GeneralStats;

    [key: string]: any;
}


export interface Player {
    _id: string;
    userId: string;
    name: string;
    role?: string;
    profileImage?: string;
    status?: "playing" | "bench" | "substitute";

    stats?: PlayerStats | Record<string, string | number | boolean | symbol>;

    [key: string]: any;
}

export interface Team {
    _id: string;
    name: string;
    members: Player[];
}

export interface MatchData {
    matchNo: number;
    team1: Team;
    team2: Team;
    venue: string;
    date: string;
    time: string;
    overs: number;
}


export interface Team {
    _id: string;
    name: string;
    members: Player[];
    logo?: string;
}

export type MatchStatus = "upcoming" | "ongoing" | "completed";

export interface Match {
    _id: string;
    matchId: string;
    tournamentId: string;
    tournamentName: string;
    matchNumber: string;
    round: number;
    date: string;
    venue: string;

    tossWinner: string | null;
    tossDecision: "Batting" | "Bowling" | null;

    status: MatchStatus;
    winner: string | null;

    teamA: Team;
    teamB: Team;

    overs: number;
}
