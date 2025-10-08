import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ILogger } from "app/providers/ILogger";
import { IGetMyTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";

export class GetMyTournamentsUseCase implements IGetMyTournaments {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) {}

    async execute(managerId: string) {
        this._logger.info(`[GetMyTournamentsUseCase] Fetching tournaments for managerId=${managerId}`);

        const tournaments = await this._tournamentRepo.getByManager(managerId) ?? [];

        this._logger.info(`[GetMyTournamentsUseCase] Fetched ${tournaments.length} tournaments`);

        return tournaments;
    }
}