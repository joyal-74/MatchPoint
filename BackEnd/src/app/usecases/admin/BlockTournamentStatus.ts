import { inject, injectable } from "tsyringe";
import { IChangeTournamentDetailStatus } from "../../repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "../../providers/ILogger";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { Tournament } from "../../../domain/entities/Tournaments";
import { NotFoundError } from "../../../domain/errors/index";


@injectable()
export class ChangeTournamentDetailStatus implements IChangeTournamentDetailStatus {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tourRepository: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(tourId: string, status: boolean) : Promise<Tournament> {

        const tournament = await this._tourRepository.update(tourId, { isBlocked: status });

        if(!tournament){
            throw new NotFoundError('Tournament not found')
        }
        this._logger.info(`User with ID ${tourId} status changed to ${status}`);

        return tournament;
    }
}
