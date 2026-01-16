import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IStartMatchUseCase } from "app/repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { ILogger } from "../../../providers/ILogger";



@injectable()
export class StartMatchUseCase implements IStartMatchUseCase {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchesRepo: IMatchesRepository,
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(matchId: string): Promise<void> {
        this._logger.info(`[StartMatchUseCase] Executing for Match ID: ${matchId}`);

        await this._matchesRepo.updateStatus(matchId, 'ongoing');
        await this._matchStatsRepo.updateStatus(matchId, 'ongoing');

        this._logger.info(`[StartMatchUseCase] Match ${matchId} successfully started.`);
    }
}
