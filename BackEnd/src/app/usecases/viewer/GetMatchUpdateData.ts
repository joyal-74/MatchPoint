import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index";
import { LiveScoreDto } from "../../../domain/dtos/LiveScoreDto";
import { IMatchStatsRepo } from "../../repositories/interfaces/manager/IMatchStatsRepo";
import { mapToLiveScoreDto } from "../../mappers/LiveScoreMapper";
import { IGetMatchUpdates } from "../../repositories/interfaces/usecases/IViewerUsecaseRepository";


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
