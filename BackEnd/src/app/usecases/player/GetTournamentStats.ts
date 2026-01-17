import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "../../providers/ILogger";
import { IGetTournamentStats } from "app/repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { ILeaderboardRepository } from "app/repositories/interfaces/shared/ILeaderboardRepository";

@injectable()
export class GetTournamentStats implements IGetTournamentStats {
    constructor(
        @inject(DI_TOKENS.LeaderboardRepository) private _leaderboardRepo: ILeaderboardRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(tournamentId : string): Promise<string[]> {

        this.logger.info(`[Fetching Matches] for tournament=${tournamentId}`);

        const result = await this._leaderboardRepo.getTournamentLeaderboard(tournamentId);

        return result;
    }
}