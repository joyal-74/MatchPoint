import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { IRetireBatsmanUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";

export class RetireBatsmanUseCase implements IRetireBatsmanUseCase {
    constructor(private matchRepo: IMatchRepo) { }

    async execute(matchId: string, outBatsmanId: string, newBatsmanId: string, isRetiredHurt: boolean): Promise<MatchEntity | null> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.retireBatsman({
            outBatsmanId,
            newBatsmanId,
            isRetiredHurt
        });

        const saved = await this.matchRepo.save(match);
        return saved;
    }
}