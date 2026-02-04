import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetPlayerTournamentMatches } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes.js";
import { IMatchesRepository } from "../../repositories/interfaces/manager/IMatchesRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { Match } from "../../../domain/entities/Match.js";


@injectable()
export class GetPlayerTournamentMatches implements IGetPlayerTournamentMatches {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchStatsRepo: IMatchesRepository,
        @inject(DI_TOKENS.Logger) private logger: ILogger
    ) { }

    async execute(tournamentId : string): Promise<Match[]> {

        this.logger.info(`[Fetching Matches] for tournament=${tournamentId}`);

        const result = await this._matchStatsRepo.getMatchesByTournament(tournamentId);

        return result;
    }
}
