import { ILogger } from "app/providers/ILogger";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { IExploreTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { Tournament } from "domain/entities/Tournaments";

export class ExploreTournamentsUseCase implements IExploreTournaments {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(filters?: Partial<Tournament>): Promise<Tournament[]> {
        this._logger.info(`[ExploreTournamentsUseCase] Exploring tournaments with filters: ${JSON.stringify(filters)}`);
        const tournaments = await this._tournamentRepo.getExploreTournaments(filters) ?? [];

        this._logger.info(`[ExploreTournamentsUseCase] Found ${tournaments.length} tournaments`);
        return tournaments;
    }
}