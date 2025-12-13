import { LiveMatchDTO } from "domain/dtos/LiveMatchDTO";
import { LiveScoreDto } from "domain/dtos/LiveScoreDto";

export interface IGetLiveMatches {
    execute(): Promise<LiveMatchDTO[]>
}

export interface IGetMatchUpdates {
    execute(matchId: string): Promise<LiveScoreDto>
}