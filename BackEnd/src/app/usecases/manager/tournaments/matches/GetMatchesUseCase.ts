import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IGetTournamentMatches } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { Match } from "domain/entities/Match";
import { BadRequestError, NotFoundError } from "domain/errors";

@injectable()
export class GetTournamentMatches implements IGetTournamentMatches {
    constructor(
        @inject(DI_TOKENS.MatchesRepository) private _matchesRepo: IMatchesRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Match[]> {
        if (!tournamentId) {
            this._logger.warn("Tournament ID not provided");
            throw new BadRequestError("Tournament ID is required");
        }

        const matches = await this._matchesRepo.getMatchesByTournament(tournamentId);

        if (!matches) {
            this._logger.info(`No Matches found for tournament ${tournamentId}`);
            throw new NotFoundError("No Matches found for this tournament");
        }

        this._logger.info(`Fetched matches for tournament ${tournamentId}`);

        return matches;
    }
}