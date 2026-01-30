import type { Team } from "../../../domain/match/types";

export interface MatchData {
    matchNo: number;
    team1: Team;
    team2: Team;
    venue: string;
    date: string;
    time: string;
    overs: number;
}

export type TossDecision = 'Batting' | 'Bowling' | null;
export type TeamId = string;


export interface Player {
    _id: string;
    name: string;
    role: string;
    profileImage?: string;
    status?: "playing" | "bench" | undefined;
    stats: PlayerStats;
}

export interface BattingStats {
    matches: number;
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
}