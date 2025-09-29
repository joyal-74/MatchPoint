import { ITournamentsResponse } from "domain/entities/Tournaments";
import { IGetAllTournaments } from "app/repositories/interfaces/manager/ITournamentUsecaseRepository";
import { ITournamentRepository } from "app/repositories/interfaces/ITournamentRepository";
import { ILogger } from "app/providers/ILogger";

export class GetAllTournamentsUseCase implements IGetAllTournaments {
    constructor(
        private _tournamentRepo: ITournamentRepository,
        private _logger: ILogger
    ) {}

    async execute(managerId: string): Promise<ITournamentsResponse> {
        this._logger.info(`[GetAllTournamentsUseCase] Fetching tournaments for managerId=${managerId}`);

        const myTournaments = (await this._tournamentRepo.getByManager(managerId)) ?? [];
        const exploreTournaments = (await this._tournamentRepo.getExploreTournaments({ managerId })) ?? [];

        this._logger.info(
            `[GetAllTournamentsUseCase] Fetched ${myTournaments.length} myTournaments, ${exploreTournaments.length} exploreTournaments`
        );

        return { myTournaments, exploreTournaments };
    }
}
