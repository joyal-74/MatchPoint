import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { ISetBowlerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";


export class SetBowlerUseCase implements ISetBowlerUseCase {
    constructor(private matchRepo: IMatchRepo) {}

    async execute(matchId: string, bowlerId: string): Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.setCurrentBowler(bowlerId);
        const updated = await this.matchRepo.save(match);
        return updated;
    }
}