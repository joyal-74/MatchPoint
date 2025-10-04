import { Tournament } from "domain/entities/Tournaments";
import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IAddTournament } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { ITournamentIdGenerator } from "app/providers/IIdGenerator";

export class AddTournamentUseCase implements IAddTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _tournamentId: ITournamentIdGenerator,
        private _logger: ILogger
    ) { }

    async execute(data: Tournament): Promise<Tournament> {
        this._logger.info(`[AddTournamentUseCase] Adding new tournament: ${data.title}`);

        const tourId = this._tournamentId.generate();
        const newData = { ...data, tourId }

        const tournament = await this._tournamentRepo.create(newData);

        this._logger.info(`[AddTournamentUseCase] Tournament added: ${data.title}`);

        return tournament
    }
}