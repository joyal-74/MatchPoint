import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { mapToLiveScoreDto } from "app/mappers/LiveScoreMapper";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IGetMatchUpdates } from "app/repositories/interfaces/usecases/IViewerUsecaseRepository";
import { LiveScoreDto } from "domain/dtos/LiveScoreDto";
import { BadRequestError, NotFoundError } from "domain/errors";

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