import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IDeleteTournament } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { NotFoundError } from "domain/errors";

export class DeleteTournament implements IDeleteTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger,
    ) { }

    async execute(tournamentId: string): Promise<string> {
        this._logger.info(`[AddTournamentUseCase] Deleting tournament with Id: ${tournamentId}`);

        const teamExist = await this._tournamentRepo.findById(tournamentId);

        if (!teamExist) throw new NotFoundError("Team not found");

        const data = await this._tournamentRepo.update(tournamentId, { isDeleted: true })

        this._logger.info(`[AddTournamentUseCase] Tournament deleted: ${data.name}`);

        return data._id;
    }
} 