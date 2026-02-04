import { inject, injectable } from "tsyringe";
import { IGetTournamentDetails } from "../../../repositories/interfaces/admin/IAdminUsecases.js";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository.js";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { ILogger } from "../../../providers/ILogger.js";
import { Tournament } from "../../../../domain/entities/Tournaments.js";
import { NotFoundError } from "../../../../domain/errors/index.js";


@injectable()
export class GetTournamentDetails implements IGetTournamentDetails {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
