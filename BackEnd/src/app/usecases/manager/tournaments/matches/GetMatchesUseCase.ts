import { ILogger } from "app/providers/ILogger";
import { IMatchesRepository } from "app/repositories/interfaces/manager/IMatchesRepository";
import { IGetTournamentMatches } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Match } from "domain/entities/Match";
import { BadRequestError, NotFoundError } from "domain/errors";

export class GetTournamentMatches implements IGetTournamentMatches {
    constructor(
        private _matchesRepo: IMatchesRepository,
        private _logger: ILogger
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