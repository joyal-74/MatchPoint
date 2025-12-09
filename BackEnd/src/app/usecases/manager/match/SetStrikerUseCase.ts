import { IMatchRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { ISetStrikerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";


export class SetStrikerUseCase implements ISetStrikerUseCase {
    constructor(private matchRepo: IMatchRepo) {}

    async execute(matchId: string, batsmanId: string): Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.setCurrentStriker(batsmanId);
        const updated = await this.matchRepo.save(match);
        return updated;
    }
}
