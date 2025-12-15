import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IAddPenaltyUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

export class AddPenaltyUseCase implements IAddPenaltyUseCase {
    constructor(private matchRepo: IMatchRepo) { }

    async execute(matchId: string, runs: number): Promise<MatchEntity | null> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.addPenaltyRuns(runs);

        const saved = await this.matchRepo.save(match);
        return saved;
    }
}