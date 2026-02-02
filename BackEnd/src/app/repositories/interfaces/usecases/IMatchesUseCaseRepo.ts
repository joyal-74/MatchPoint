import { LiveScoreDto } from "domain/dtos/LiveScoreDto";
import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { AddWicketPayload } from "domain/entities/Innings";
import { InitInningsPayload, MatchEntity } from "domain/entities/MatchEntity";

export type AddRunsPayload = {
    matchId: string;
    runs: number;
};

export interface EndMatchUseCaseInput {
    matchId: string;
    reason: string;
    endedBy?: string;
    type?: string;
    notes?: string;
    resultData?: {
        winnerId: string | null;
        resultType: 'WIN' | 'TIE' | 'DRAW';
        winType?: 'runs' | 'wickets';
        margin?: string;
    } | null;
}

export interface IGetMatchDetails {
    execute(matchId: string): Promise<MatchResponseDTO>
}

export interface ISaveMatchData {
    execute(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity>
}

export interface IStartMatchUseCase {
    execute(matchId: string): Promise<void>;
}

export interface IGetLiveScoreUseCase {
    execute(matchId: string): Promise<LiveScoreDto>;
}

export interface IAddWicketUseCase {
    execute(payload: AddWicketPayload): Promise<MatchEntity | null>;
}

export interface IAddRunsUseCase {
    execute({ matchId, runs }: AddRunsPayload): Promise<MatchEntity | null>;
}

export interface IInitInningsUseCase {
    execute(payload: InitInningsPayload): Promise<MatchEntity | null>;
}

export interface ISetBowlerUseCase {
    execute(matchId: string, bowlerId: string): Promise<MatchEntity | null>;
}

export interface ISetStrikerUseCase {
    execute(matchId: string, batsmanId: string): Promise<MatchEntity | null>;
}

export interface ISetNonStrikerUseCase {
    execute(matchId: string, batsmanId: string): Promise<MatchEntity | null>;
}

export interface IUndoLastBallUseCase {
    execute(matchId: string): Promise<MatchEntity | null>;
}

export interface IStartSuperOverUseCase {
    execute(matchId: string): Promise<MatchEntity | null>;
}

export interface IEndOverUseCase {
    execute(matchId: string): Promise<MatchEntity | null>;
}

export interface IEndInningsUseCase {
    execute(matchId: string): Promise<MatchEntity | null>;
}

export interface IAddPenaltyUseCase {
    execute(matchId: string, runs: number): Promise<MatchEntity | null>;
}

export interface IRetireBatsmanUseCase {
    execute(matchId: string, outBatsmanId: string, newBatsmanId: string, isRetiredHurt: boolean): Promise<MatchEntity | null>;
}

export interface IAddExtrasUseCase {
    execute({ matchId, type, runs }: { matchId: string, type: string, runs: number }): Promise<MatchEntity | null>;
}

export interface IEndMatchUseCase {
    execute(input: EndMatchUseCaseInput): Promise<MatchEntity>;
}

export interface IGetAllMatches {
    execute(search: string, limit: number, page: number): Promise<{ matches: MatchEntity[], totalPages: number }>;
}

export interface IGetUmpireAllMatches {
    execute(userId: string, search: string, limit: number, page: number): Promise<{ matches: MatchEntity[], totalPages: number }>;
}