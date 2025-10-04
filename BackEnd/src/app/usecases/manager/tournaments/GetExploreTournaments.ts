import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ILogger } from "app/providers/ILogger";
import { IGetExploreTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";

export class ExploreTournamentsUseCase implements IGetExploreTournaments {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) {}

    async execute(filters : Partial<Tournament>) {
        this._logger.info(`[GetExploreTournamentsUseCase] Fetching explore tournaments excluding managerId=${filters.managerId}`);

        const tournaments = await this._tournamentRepo.getExploreTournaments(filters) ?? [];

        this._logger.info(`[GetExploreTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}