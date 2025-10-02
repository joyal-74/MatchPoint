import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { Tournament } from "domain/entities/Tournaments";
import { IEditTournament } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";

export class EditTournamentUseCase implements IEditTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(data: Partial<Tournament>): Promise<Tournament> {
        if (!data._id) throw new Error("Tournament ID is required for edit");

        this._logger.info(`[EditTournamentUseCase] Editing tournament id=${data._id}`);
        const updated = await this._tournamentRepo.update(data._id, data);

        if (!updated) {
            this._logger.warn(`[EditTournamentUseCase] Tournament not found id=${data._id}`);
            throw new Error(`Tournament with id=${data._id} not found`);
        }

        this._logger.info(`[EditTournamentUseCase] Tournament updated id=${data._id}`);
        return updated;
    }
}
