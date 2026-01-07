import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IAddExtrasUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

@injectable()
export class AddExtrasUseCase implements IAddExtrasUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute({ matchId, type, runs }: { matchId: string; type: string; runs: number }): Promise<MatchEntity> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.addExtras(type, runs);
        const updated = await this._matchStatsRepo.save(match);
        return updated;
    }
}