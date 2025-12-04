import { IMatchScoreRepository } from "app/repositories/interfaces/manager/IMatcheScoreRepository";
import { IInitInningsUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";

export class InitInningsUseCase implements IInitInningsUseCase {
    constructor(private readonly repo: IMatchScoreRepository) { }

    async execute(matchId: string) {
        let match = await this.repo.getMatch(matchId);

        if (!match) {
            match = await this.repo.createInitialMatch(matchId);
        }

        const inn = match.currentInnings === 1 ? match.innings1 : match.innings2;

        if (!inn) return match;

        if (inn.currentStriker && inn.currentNonStriker && inn.currentBowler) {
            return match;
        }

        await this.repo.save(match);

        return this.repo.getMatch(matchId);
    }
}
