import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IEndOverUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

@injectable()
export class EndOverUseCase implements IEndOverUseCase {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string): Promise<MatchEntity | null> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.endOver();

        const saved = await this._matchStatsRepo.save(match);
        return saved;
    }
}