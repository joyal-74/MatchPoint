import { inject, injectable } from "tsyringe";
import { IGetTournamentDetails } from "../../../repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "../../../repositories/interfaces/shared/ITournamentRepository";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers";
import { ILogger } from "../../../providers/ILogger";
import { Tournament } from "../../../../domain/entities/Tournaments";
import { NotFoundError } from "../../../../domain/errors/index";


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
