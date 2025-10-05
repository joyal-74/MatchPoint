import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ILogger } from "app/providers/ILogger";
import { IGetExploreTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";

export class ExploreTournamentsUseCase implements IGetExploreTournaments {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(managerId: string, page: number, limit: number, search: string, filter: string): Promise<Tournament[]> {

        this._logger.info(`[GetExploreTournamentsUseCase] Fetching explore tournaments based on filters`);

        const tournaments = await this._tournamentRepo.getExploreTournaments(managerId, page, limit, search, filter) ?? [];

        this._logger.info(`[GetExploreTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}