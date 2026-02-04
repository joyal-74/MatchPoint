import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetTournamentStats } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { ILeaderboardRepository } from "../../repositories/interfaces/shared/ILeaderboardRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { Leaderboard } from "../../../domain/entities/Tournaments.js";


@injectable()
export class GetTournamentStats implements IGetTournamentStats {
    constructor(
        @inject(DI_TOKENS.LeaderboardRepository) private _leaderboardRepo: ILeaderboardRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(tournamentId : string): Promise<Leaderboard> {

        this.logger.info(`[Fetching Matches] for tournament=${tournamentId}`);

        const result = await this._leaderboardRepo.getTournamentLeaderboard(tournamentId);

        return result;
    }
}
