import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IChangeTournamentDetailStatus } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";

@injectable()
export class ChangeTournamentDetailStatus implements IChangeTournamentDetailStatus {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tourRepository: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tourId: string, status: boolean) {

        console.log(status, 'ppp')

        const tournament = await this._tourRepository.update(tourId, { isBlocked: status });
        this._logger.info(`User with ID ${tourId} status changed to ${status}`);

        return tournament;
    }
}