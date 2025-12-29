import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { EndMatchUseCaseInput, IEndMatchUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";

export class EndMatchUseCase implements IEndMatchUseCase {
    constructor(
        private matchesRepo: IMatchesRepository,
        private matchStatsRepo: IMatchStatsRepo,
    ) { }

    async execute(input: EndMatchUseCaseInput): Promise<MatchEntity> {
        const { matchId, type, reason, notes, endedBy } = input;

        console.log(input)

        const updatedMatch = await this.matchesRepo.endMatch(matchId, {
            type,
            reason,
            notes,
            endedBy: endedBy ?? null
        });

        await this.matchStatsRepo.updateStatus(matchId, 'completed')

        return updatedMatch;
    }
}