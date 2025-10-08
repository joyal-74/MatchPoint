import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ICancelTournament } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

export class CancelTournamentUsecase implements ICancelTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger,
    ) { }

    async execute(tournamentId: string, reason: string): Promise<string> {
        this._logger.info(`[AddTournamentUseCase] Deleting tournament with Id: ${tournamentId}`);

        const teamExist = await this._tournamentRepo.findById(tournamentId);

        if (!teamExist) throw new NotFoundError("Team not found");

        const data = await this._tournamentRepo.cancel(tournamentId, reason)

        if (!data) {
            throw new BadRequestError("Cannot cancel a tournament that has ended or is already cancelled");
        }

        this._logger.info(`[AddTournamentUseCase] Tournament cancelled: ${data.title}`);

        return data._id;
    }
} 