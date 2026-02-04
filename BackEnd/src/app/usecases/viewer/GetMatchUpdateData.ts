import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";
import { LiveScoreDto } from "../../../domain/dtos/LiveScoreDto.js";
import { IMatchStatsRepo } from "../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { mapToLiveScoreDto } from "../../mappers/LiveScoreMapper.js";
import { IGetMatchUpdates } from "../../repositories/interfaces/usecases/IViewerUsecaseRepository.js";


@injectable()
export class GetMatchUpdates implements IGetMatchUpdates {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string): Promise<LiveScoreDto> {
        if (!matchId) {
            throw new BadRequestError("Match ID is required");
        }

        const match = await this._matchRepo.findByMatchId(matchId);

        if (!match) {
            throw new NotFoundError("Match not found");
        }

        return mapToLiveScoreDto(match);
    }
}
