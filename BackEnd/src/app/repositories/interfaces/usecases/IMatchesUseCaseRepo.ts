import { MatchResponseDTO } from "domain/dtos/MatchDTO";
import { MatchEntity } from "domain/entities/Match";

export type AddRunsPayload = {
    matchId: string;
    runs: number;
};


export interface IGetMatchDetails {
    execute(matchId: string): Promise<MatchResponseDTO>
}

export interface ISaveMatchData {
    execute(matchId: string, tossWinnerId: string, tossDecision: string): Promise<MatchEntity>
}
export interface IGetLiveScoreUseCase {
    execute(matchId: string)
}

export interface IAddWicketUseCase {
    execute({ matchId, dismissalType, outBatsmanId, nextBatsmanId, fielderId }: { matchId: string; dismissalType: string; outBatsmanId: string; nextBatsmanId: string; fielderId : string })

}

export interface IAddRunsUseCase {
    execute({ matchId, runs }: AddRunsPayload)
}

export interface IInitInningsUseCase {
    execute(matchId: string)
}

export interface ISetBowlerUseCase {
    execute(matchId: string, bowlerId: string)
}

export interface ISetStrikerUseCase {
    execute(matchId: string, batsmanId: string)
}

export interface ISetNonStrikerUseCase {
    execute(matchId: string, batsmanId: string)
}
