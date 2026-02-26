import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { NotFoundError } from "../../../../domain/errors/index";
import { ISetBowlerUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { MatchEntity } from "../../../../domain/entities/MatchEntity";


@injectable()
export class SetBowlerUseCase implements ISetBowlerUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) {}

    async execute(matchId: string, bowlerId: string): Promise<MatchEntity> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.setCurrentBowler(bowlerId);
        const updated = await this._matchStatsRepo.save(match);
        return updated;
    }
}
