import { inject, injectable } from "tsyringe";
import { IEndInningsUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { NotFoundError } from "../../../../domain/errors/index.js";


@injectable()
export class EndInningsUseCase implements IEndInningsUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string): Promise<MatchEntity | null> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.endInnings();

        const saved = await this._matchStatsRepo.save(match);
        return saved;
    }
}
