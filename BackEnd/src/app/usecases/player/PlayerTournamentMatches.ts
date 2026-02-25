import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetPlayerTournamentMatches } from "../../repositories/interfaces/usecases/ITournamentsRepoUsecaes";
import { IMatchesRepository } from "../../repositories/interfaces/manager/IMatchesRepository";
import { ILogger } from "../../providers/ILogger";
import { Match } from "../../../domain/entities/Match";


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
