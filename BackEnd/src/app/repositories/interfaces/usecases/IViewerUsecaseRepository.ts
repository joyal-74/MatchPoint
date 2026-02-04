import { LiveMatchDTO } from "../../../../domain/dtos/LiveMatchDTO.js";
import { LiveScoreDto } from "../../../../domain/dtos/LiveScoreDto.js";

export interface IGetLiveMatches {
    execute(): Promise<LiveMatchDTO[]>
}

export interface IGetMatchUpdates {
    execute(matchId: string): Promise<LiveScoreDto>
}
