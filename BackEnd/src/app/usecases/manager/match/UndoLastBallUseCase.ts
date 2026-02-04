import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { IUndoLastBallUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo.js";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { MatchEntity } from "../../../../domain/entities/MatchEntity.js";
import { NotFoundError } from "../../../../domain/errors/index.js";


@injectable()
export class UndoLastBallUseCase implements IUndoLastBallUseCase {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo
    ) { }

    async execute(matchId: string): Promise<MatchEntity> {
        const match = await this._matchStatsRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.undoLastBall();
        const updated = await this._matchStatsRepo.save(match);
        return updated;
    }
}
