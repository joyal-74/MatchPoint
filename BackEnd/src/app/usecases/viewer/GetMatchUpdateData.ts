import { mapToLiveScoreDto } from "app/mappers/LiveScoreMapper";
import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IGetMatchUpdates } from "app/repositories/interfaces/usecases/IViewerUsecaseRepository";
import { LiveScoreDto } from "domain/dtos/LiveScoreDto";
import { BadRequestError, NotFoundError } from "domain/errors";

export class GetMatchUpdates implements IGetMatchUpdates {
    constructor(
        private _matchRepo: IMatchRepo
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