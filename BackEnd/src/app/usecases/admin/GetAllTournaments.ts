import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetTournamentUsecase } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { Tournament } from "../../../domain/entities/Tournaments.js";
import { AdminFilters } from "../../../domain/dtos/Team.dto.js";


@injectable()
export class GetAllTournaments implements IGetTournamentUsecase {
    constructor(
        @inject(DI_TOKENS.TournamentRepository) private _tournamnetRepository: ITournamentRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(params: AdminFilters): Promise<{ tournaments: Tournament[], total: number }> {
        this._logger.info("Fetching all players");
        let isBlocked : boolean | undefined;

        if(params.filter === 'Blocked') {
            isBlocked = true
        }else if (params.filter === 'Active') {
            isBlocked = false
        } 

        console.log(params, 'llllllllllllll')

        const { total, tournaments } = await this._tournamnetRepository.findByFilters({...params, isBlocked});

        this._logger.info(`Found ${total} teams`);

        return { tournaments, total };
    }
}
