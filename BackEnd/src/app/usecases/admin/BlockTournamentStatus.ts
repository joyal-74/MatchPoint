import { ILogger } from "app/providers/ILogger";
import { IChangeTournamentDetailStatus } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";

export class ChangeTournamentDetailStatus implements IChangeTournamentDetailStatus {
    constructor(
        private _tourRepository: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(tourId: string, status: boolean) {

        console.log(status, 'ppp')

        const tournament = await this._tourRepository.update(tourId, { isBlocked: status });
        this._logger.info(`User with ID ${tourId} status changed to ${status}`);

        return tournament;
    }
}