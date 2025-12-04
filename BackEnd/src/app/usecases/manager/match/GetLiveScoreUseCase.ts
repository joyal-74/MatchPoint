import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { LiveScoreMapper } from "app/mappers/LiveScoreMapper";
import { NotFoundError } from "domain/errors";
import { IGetLiveScoreUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

export class GetLiveScoreUseCase implements IGetLiveScoreUseCase {
    constructor(private repo: IMatchScoreRepository) { }

    async execute(matchId: string) {
        const match = await this.repo.getMatch(matchId);
        if (!match) throw new NotFoundError("")
        const liveScore = LiveScoreMapper.toDto(match);
        return liveScore
    }
}
