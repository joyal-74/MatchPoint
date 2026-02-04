import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { IGetLiveScoreUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { NotFoundError } from "../../../../domain/errors/index.js";
import { mapToLiveScoreDto } from "../../../mappers/LiveScoreMapper.js";
import { LiveScoreDto } from "../../../../domain/dtos/LiveScoreDto.js";


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
