import { InitInningsPayload, MatchEntity } from "../../../domain/entities/MatchEntity.js"; 

export interface IMatchScoreService {
    initInnings(payload: InitInningsPayload): Promise<MatchEntity | null>;

    setStriker(matchId: string, batsmanId: string): Promise<MatchEntity | null>;

    setNonStriker(matchId: string, batsmanId: string): Promise<MatchEntity | null>;

    setBowler(matchId: string, bowlerId: string): Promise<MatchEntity | null>;

    addRuns(matchId: string, runs: number): Promise<MatchEntity | null>;

    addExtras(matchId: string, type: string, runs: number): Promise<MatchEntity | null>;

    addWicket(matchId: string, dismissalType: string, outBatsmanId: string, nextBatsmanId: string, bowlerId: string, isLegalBall: boolean, fielderId?: string): Promise<MatchEntity | null>;

    undoLastBall(matchId: string): Promise<MatchEntity | null>;

    startSuperOver(matchId: string): Promise<MatchEntity | null>;

    endOver(matchId: string): Promise<MatchEntity | null>;

    endInnings(matchId: string): Promise<MatchEntity | null>;

    addPenalty(matchId: string, runs: number): Promise<MatchEntity | null>;

    retireBatsman(matchId: string, outBatsmanId: string, newBatsmanId: string, isRetiredHurt: boolean): Promise<MatchEntity | null>;
}
