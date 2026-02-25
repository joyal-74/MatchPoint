import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { NotFoundError } from "../../../../domain/errors/index";
import { IRetireBatsmanUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { MatchEntity } from "../../../../domain/entities/MatchEntity";


@injectable()
export class RetireBatsmanUseCase implements IRetireBatsmanUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string, outBatsmanId: string, newBatsmanId: string, isRetiredHurt: boolean): Promise<MatchEntity | null> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.retireBatsman({
            outBatsmanId,
            newBatsmanId,
            isRetiredHurt
        });

        const saved = await this._matchStatsRepo.save(match);
        return saved;
    }
}
