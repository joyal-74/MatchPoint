import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IUndoLastBallUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";


export class UndoLastBallUseCase implements IUndoLastBallUseCase {
    constructor(private matchRepo: IMatchStatsRepo) {}

    async execute(matchId: string): Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.undoLastBall();
        const updated = await this.matchRepo.save(match);
        return updated;
    }
}
