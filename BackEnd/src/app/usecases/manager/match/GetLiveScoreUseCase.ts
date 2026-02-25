import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { IGetLiveScoreUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { NotFoundError } from "../../../../domain/errors/index";
import { mapToLiveScoreDto } from "../../../mappers/LiveScoreMapper";
import { LiveScoreDto } from "../../../../domain/dtos/LiveScoreDto";


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
