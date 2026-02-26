import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { NotFoundError } from "../../../../domain/errors/index";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { IEndOverUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "../../../../domain/entities/MatchEntity";


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
