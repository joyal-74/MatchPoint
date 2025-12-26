import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { mapToLiveScoreDto } from "app/mappers/LiveScoreMapper";
import { NotFoundError } from "domain/errors";
import { IGetLiveScoreUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { LiveScoreDto } from "domain/dtos/LiveScoreDto";

export class GetLiveScoreUseCase implements IGetLiveScoreUseCase {
    constructor(
        private _matchRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string) : Promise<LiveScoreDto> {
        const match = await this._matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError(`Match not found for ID: ${matchId}`);
        
        const liveScore = mapToLiveScoreDto(match);
        return liveScore;
    }
}