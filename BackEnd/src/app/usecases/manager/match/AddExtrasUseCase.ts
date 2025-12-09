import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IAddExtrasUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

export class AddExtrasUseCase implements IAddExtrasUseCase {
    constructor(
        private matchRepo: IMatchRepo
    ) { }

    async execute({ matchId, type, runs }: { matchId: string; type: string; runs: number }): Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.addExtras(type, runs);
        const updated = await this.matchRepo.save(match);
        return updated;
    }
}