import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { mapToLiveScoreDto } from "app/mappers/LiveScoreMapper";
import { NotFoundError } from "domain/errors";
import { IGetLiveScoreUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { LiveScoreDto } from "domain/dtos/LiveScoreDto";

@injectable()
export class GetLiveScoreUseCase implements IGetLiveScoreUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string) : Promise<LiveScoreDto> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError(`Match not found for ID: ${matchId}`);
        
        const liveScore = mapToLiveScoreDto(match);
        return liveScore;
    }
}