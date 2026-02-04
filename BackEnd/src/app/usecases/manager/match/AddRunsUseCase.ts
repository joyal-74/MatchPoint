import { inject, injectable } from "tsyringe";
import { AddRunsPayload, IAddRunsUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { NotFoundError } from "../../../../domain/errors/index.js";


@injectable()
export class AddRunsUseCase implements IAddRunsUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute({ matchId, runs }: AddRunsPayload): Promise<MatchEntity> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.addRunsToCurrentInnings({ strikerId: match.currentStriker!, bowlerId: match.currentBowler!, runs });
        const updated = await this._matchStatsRepo.save(match);
        return updated;
    }
}
