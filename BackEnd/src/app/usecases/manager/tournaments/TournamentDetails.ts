import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IGetTournamentDetails } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";

export class GetTournamentDetails implements IGetTournamentDetails {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Tournament> {
        
        const tournament = await this._tournamentRepo.findById(tournamentId);

        if (!tournament) {
            this._logger.error(`Tournament not found: ${tournamentId}`);
            throw new NotFoundError("Tournament not found");
        }

        this._logger.info(`Fetched tournament details for ID: ${tournamentId}`);
        return tournament;
    }
}