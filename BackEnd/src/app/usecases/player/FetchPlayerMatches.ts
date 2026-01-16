import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "../../providers/ILogger";
import { IGetPlayerMatches } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { IMatchStatsRepo } from "app/repositories/interfaces/manager/IMatchStatsRepo";
import { LiveMatchCardDTO } from "domain/dtos/LiveMatchDTO";

@injectable()
export class FetchMatchesUseCase implements IGetPlayerMatches {
    constructor(
        @inject(DI_TOKENS.MatchStatsRepository) private _matchStatsRepo: IMatchStatsRepo,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(status: string, page: number, limit: number): Promise<LiveMatchCardDTO[]> {

        this.logger.info(`[Fetching Matches] status=${status}`);

        const result = await this._matchStatsRepo.findLiveMatches({ page, limit });

        console.log(result)

        return result;
    }
}