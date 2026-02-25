import { inject, injectable } from "tsyringe";

import { ILogger } from "../../../providers/ILogger";
import { IStartMatchUseCase } from "../../../repositories/interfaces/usecases/IMatchesUseCaseRepo";
import { IMatchesRepository } from "../../../repositories/interfaces/manager/IMatchesRepository";
import { IMatchStatsRepo } from "../../../repositories/interfaces/manager/IMatchStatsRepo";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";



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
