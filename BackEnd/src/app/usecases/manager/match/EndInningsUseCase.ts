import { inject, injectable } from "tsyringe";
import { IEndInningsUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { MatchEntity } from "../../../../domain/entities/MatchEntity";
import { NotFoundError } from "../../../../domain/errors/index";


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
