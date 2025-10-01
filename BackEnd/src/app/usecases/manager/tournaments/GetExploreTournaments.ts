import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ILogger } from "app/providers/ILogger";
import { IGetExploreTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";

export class GetExploreTournamentsUseCase implements IGetExploreTournaments {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) {}

    async execute(managerId: string) {
        this._logger.info(`[GetExploreTournamentsUseCase] Fetching explore tournaments excluding managerId=${managerId}`);

        const tournaments = await this._tournamentRepo.getExploreTournaments({ managerId }) ?? [];

        this._logger.info(`[GetExploreTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}