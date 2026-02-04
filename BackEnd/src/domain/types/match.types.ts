import { MatchStatus } from "../../domain/entities/Fixture.js";
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

export type DismissalType = 
    | "bowled" 
    | "caught" 
    | "run-out"
    | "lbw" 
    | "stumped" 
    | "hit-wicket" 
    | "retired-hurt" 
    | "retired-out"
    | "timed-out"
    | "obstructing-field"
    | "hit-ball-twice";

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
    nextBatsmanId?: string;
    outWasStriker?: boolean;
}

export interface InningsDTO {
    battingTeam: string;
    bowlingTeam: string;
    runs: number;
    wickets: number;
    deliveries?: number;
    legalBalls?: number;
    
    currentStriker: string | null;
    currentNonStriker: string | null;
    currentBowler: string | null;
    
    initialStriker?: string | null;
    initialNonStriker?: string | null;
    initialBowler?: string | null;
    
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
    oversLimit?: number;
}

export interface TournamentMatchStatsDocument extends Document {
    tournamentId: string;
    matchId: string;
    innings1: InningsDTO;
    innings2: InningsDTO | null;
    oversLimit: number;
    superOver1?: InningsDTO | null;
    superOver2?: InningsDTO | null;
    hasSuperOver: boolean;
    currentInnings: number;
    isLive: boolean;
    status: MatchStatus;
    venue?: string;
}

export type ScoreUpdateType =
    | "RUNS" 
    | "EXTRA" 
    | "UNDO" 
    | "WICKET" 
    | "SET_STRIKER" 
    | "SET_NON_STRIKER" 
    | "SET_BOWLER" 
    | "INIT_INNINGS" 
    | "START_SUPER_OVER" 
    | 'PENALTY' 
    | 'RETIRE' 
    | 'END_OVER' 
    | 'END_INNINGS';

export interface ScoreUpdatePayload {
    matchId: string;
    type: ScoreUpdateType;
    
    runs?: number;
    strikerId?: string;
    bowlerId?: string;
    isLegalBall?: boolean;
    
    extraType?: ExtraType;
    extraRuns?: number;
    
    dismissalType?: DismissalType;
    nextBatsmanId?: string;
    fielderId?: string;
    
    outBatsmanId?: string;
    newBatsmanId?: string;
    isRetiredHurt?: boolean;
    
    oversLimit?: number;
    nonStrikerId?: string;
    battingTeamId?: string;
    bowlingTeamId?: string;
    
    batsmanId?: string;
}

export type IncomingScoreUpdatePayload = Partial<ScoreUpdatePayload> & {
    [key: string]: unknown;
};
