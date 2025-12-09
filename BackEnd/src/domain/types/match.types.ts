import { Document } from "mongoose";

export interface BatsmanStat {
    playerId: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    out: boolean;
    dismissalType?: string;
    fielderId?: string;
    retiredHurt?: boolean;
}

export interface BowlerStat {
    playerId: string;
    overs: number;
    balls: number;
    runsConceded: number;
    wickets: number;
}

export interface Extras {
    wides: number;
    noBalls: number;
    legByes: number;
    byes: number;
    penalty: number;
}

export type ExtraType = | "wide" | "noBall" | "bye" | "legBye" | "penalty";

export type DismissalType = | "bowled" | "caught" | "runout" | "lbw" | "stumped" | "hit-wicket" | "retired-hurt" | "retired-out";

export interface ExtraDetail {
    type: ExtraType;
    runs: number;
    isLegalBall: boolean;
}

export interface BallLog {
    over: number;
    ballInOver: number;

    strikerId?: string;
    nonStrikerId?: string;
    bowlerId?: string;

    runs: number;

    extrasType?: ExtraType;
    extrasRuns?: number;

    isLegalBall: boolean;

    dismissal?: {
        type: string;
        outBatsmanId?: string;
        fielderId?: string;
    };

    timestamp?: number;
}

export interface InningsDTO {
    battingTeam: string;
    bowlingTeam: string;

    runs: number;
    wickets: number;
    balls: number;

    currentStriker: string | null;
    currentNonStriker: string | null;
    currentBowler: string | null;

    batsmen: BatsmanStat[];
    bowlers: BowlerStat[];

    extras: {
        wides: number;
        noBalls: number;
        legByes: number;
        byes: number;
        penalty: number;
        total: number;
    };

    logs: BallLog[];

    isCompleted: boolean;
    isSuperOver: boolean;
}

export interface TournamentMatchStatsDocument extends Document {
    tournamentId: string;
    matchId: string;

    innings1: InningsDTO;
    innings2: InningsDTO | null;

    oversLimit: number,

    superOver1?: InningsDTO | null;
    superOver2?: InningsDTO | null;
    hasSuperOver: boolean;

    currentInnings: number;
    isLive: boolean;
}

export type ScoreUpdateType =
    | "RUNS" | "EXTRA" | "UNDO" | "WICKET" | "SET_STRIKER" | "SET_NON_STRIKER" | "SET_BOWLER" 
    | "INIT_INNINGS" | "START_SUPER_OVER" | 'PENALTY' | 'RETIRE' | 'END_OVER' | 'END_INNINGS'


export interface ScoreUpdatePayload {
    matchId: string;
    type: ScoreUpdateType;

    // for extras
    extraType?: ExtraType;
    extraRuns?: number;

    // wicket
    dismissalType?: DismissalType;
    outBatsmanId?: string;
    nextBatsmanId?: string;
    fielderId?: string;
    bowlerId?: string;
    isLegalBall?: string;

    // runs
    runs?: number;
}

export type IncomingScoreUpdatePayload = Partial<ScoreUpdatePayload> & {
    [key: string]: unknown
};