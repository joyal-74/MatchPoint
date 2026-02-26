import { ExtraType } from "./Extra";

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
    dismissal?: { type: string; outBatsmanId?: string; fielderId?: string };
    timestamp?: number;
    nextBatsmanId?: string;
    outWasStriker?: boolean;
}
