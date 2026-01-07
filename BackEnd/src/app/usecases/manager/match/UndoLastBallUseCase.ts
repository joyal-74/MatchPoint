import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IUndoLastBallUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

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
