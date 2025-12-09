import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { AddRunsPayload, IAddRunsUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";


export class AddRunsUseCase implements IAddRunsUseCase {
    constructor(private matchRepo: IMatchRepo) { }

    async execute({ matchId, runs }: AddRunsPayload): Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.addRunsToCurrentInnings({ strikerId: match.currentStriker!, bowlerId: match.currentBowler!, runs });
        const updated = await this.matchRepo.save(match);
        return updated;
    }
}