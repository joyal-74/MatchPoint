import { inject, injectable } from "tsyringe";
import { IChangeTournamentDetailStatus } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";


@injectable()
export class ChangeTournamentDetailStatus implements IChangeTournamentDetailStatus {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tourRepository: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tourId: string, status: boolean) {

        const tournament = await this._tourRepository.update(tourId, { isBlocked: status });
        this._logger.info(`User with ID ${tourId} status changed to ${status}`);

        return tournament;
    }
}
