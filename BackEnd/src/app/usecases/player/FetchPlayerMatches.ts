import { inject, injectable } from "tsyringe";
import { IGetPlayerMatches } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { IMatchStatsRepo } from "../../repositories/interfaces/manager/IMatchStatsRepo.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ILogger } from "../../providers/ILogger.js";
import { LiveMatchCardDTO } from "../../../domain/dtos/LiveMatchDTO.js";


@injectable()
export class FetchMatchesUseCase implements IGetPlayerMatches {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(status: string, page: number, limit: number): Promise<LiveMatchCardDTO[]> {

        this.logger.info(`[Fetching Matches] status=${status}`);

        const result = await this._matchStatsRepo.findLiveMatches({ page, limit });

        return result;
    }
}
