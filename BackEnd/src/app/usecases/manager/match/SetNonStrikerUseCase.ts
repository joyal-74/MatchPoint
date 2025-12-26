import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { ISetNonStrikerUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";
import { NotFoundError } from "domain/errors";


export class SetNonStrikerUseCase implements ISetNonStrikerUseCase {
    constructor(private matchRepo: IMatchStatsRepo) {}

    async execute(matchId: string, batsmanId: string) : Promise<MatchEntity> {
        const match = await this.matchRepo.findByMatchId(matchId);
        if (!match) throw new NotFoundError("Match not found");

        match.setCurrentNonStriker(batsmanId);
        const updated = await this.matchRepo.save(match);
        return updated;
    }
}
