import { ITournamentsResponse, Tournament } from "domain/entities/Tournaments";
import { GetAllTournamentsUseCase } from "./GetAllTournamentsUseCase";
import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IAddTournament } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";

export class AddTournamentUseCase implements IAddTournament {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(data: Tournament): Promise<ITournamentsResponse> {
        this._logger.info(`[AddTournamentUseCase] Adding new tournament: ${data.name}`);
        await this._tournamentRepo.create(data);

        this._logger.info(`[AddTournamentUseCase] Tournament added: ${data.name}`);
        // Return updated list after adding
        return await new GetAllTournamentsUseCase(this._tournamentRepo, this._logger).execute(data.managerId);
    }
}
