import { ILogger } from "app/providers/ILogger";
import { AdminTableParams, IChangeTournamentStatus } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";

export class ChangeTournamentStatus implements IChangeTournamentStatus {
    constructor(
        private _tournamentRepository: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(tournamentId: string, status: boolean, params: AdminTableParams) {
        console.log(status)
        const res = await this._tournamentRepository.update(tournamentId, { isBlocked: status });
        console.log(res)
        this._logger.info(`Tournamnt with ID ${tournamentId} status changed to ${status}`);

        const result = await this._tournamentRepository.findByFilters(params);
        const tournaments = result.tournaments;
        const totalCount = result.total;
        this._logger.info(`Tournament count: ${tournaments.length}`);

        return { tournaments, totalCount };
    }
}