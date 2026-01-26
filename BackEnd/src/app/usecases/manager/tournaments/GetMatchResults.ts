import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { ILogger } from "app/providers/ILogger";
import { IGetMyTournamentMatchResult } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";

@injectable()
export class GetMyTournamentMatchResult implements IGetMyTournamentMatchResult {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(managerId: string) {
        this._logger.info(`[GetMyTournamentsUseCase] Fetching tournaments for managerId=${managerId}`);

        const tournaments = await this._matchStatsRepo.getCompletedMatches(managerId) ?? [];

        console.log(tournaments, 'ggg')

        this._logger.info(`[GetMyTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}