import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { EndMatchUseCaseInput, IEndMatchUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { MatchEntity } from "domain/entities/MatchEntity";

@injectable()
export class EndMatchUseCase implements IEndMatchUseCase {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchesRepo: IMatchesRepository,
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
    ) { }

    async execute(input: EndMatchUseCaseInput): Promise<MatchEntity> {
        const { matchId, type, reason, notes, endedBy } = input;

        console.log(input)

        const updatedMatch = await this._matchesRepo.endMatch(matchId, {
            type,
            reason,
            notes,
            endedBy: endedBy ?? null
        });

        await this._matchStatsRepo.updateStatus(matchId, 'completed')

        return updatedMatch;
    }
}