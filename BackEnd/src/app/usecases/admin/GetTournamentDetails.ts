import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { IGetTournamentDetails } from "app/repositories/interfaces/usecases/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";
import { NotFoundError } from "domain/errors";


export class GetTournamentDetails implements IGetTournamentDetails {
    constructor(
        private _tourRepo: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Tournament> {
        const tournament = await this._tourRepo.findById(tournamentId);

        if (!tournament) {
            this._logger.warn(`Team not found for ID: ${tournamentId}`);
            throw new NotFoundError("Manager not found");
        }

        return tournament;
    }
}