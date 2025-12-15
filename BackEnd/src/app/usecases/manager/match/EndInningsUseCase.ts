import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IEndInningsUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

export class EndInningsUseCase implements IEndInningsUseCase {
    constructor(private matchRepo: IMatchRepo) { }

    async execute(matchId: string): Promise<MatchEntity | null> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.endInnings();

        const saved = await this.matchRepo.save(match);
        return saved;
    }
}