import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { AdminTableParams, IChangeTournamentStatus } from "../../repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "../../providers/ILogger";


@injectable()
export class ChangeTournamentStatus implements IChangeTournamentStatus {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamentRepository: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
