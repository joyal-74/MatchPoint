import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository.js";
import { IGetTournamentDetails } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { Tournament } from "../../../domain/entities/Tournaments.js";
import { ILogger } from "../../providers/ILogger.js";
import { NotFoundError } from "../../../domain/errors/index.js";

@injectable()
export class AdminGetTournamentDetails implements IGetTournamentDetails {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tourRepo: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tournamentId: string): Promise<Tournament> {
        const tournament = await this._tourRepo.findById(tournamentId);

        if (!tournament) {
            this._logger.warn(`AdminGetTournamentDetails => Tournament not found with ID: ${tournamentId}`);
            throw new NotFoundError("Tournament not found");
        }

        this._logger.info(`AdminGetTournamentDetails => Successfully retrieved: "${tournament.title}" (ID: ${tournamentId})`);

        return tournament;
    }
}