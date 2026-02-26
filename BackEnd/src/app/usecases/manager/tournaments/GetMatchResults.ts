import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { IGetMyTournamentMatchResult } from "../../../repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { ILogger } from "../../../providers/ILogger";


@injectable()
export class GetMyTournamentMatchResult implements IGetMyTournamentMatchResult {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(managerId: string) {
        this._logger.info(`[GetMyTournamentsUseCase] Fetching tournaments for managerId=${managerId}`);

        const tournaments = await this._matchStatsRepo.getCompletedMatches(managerId) ?? [];

        this._logger.info(`[GetMyTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}
