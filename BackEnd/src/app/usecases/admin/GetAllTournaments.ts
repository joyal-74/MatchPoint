import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetTournamentUsecase } from "../../repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "../../repositories/interfaces/shared/ITournamentRepository";
import { ILogger } from "../../providers/ILogger";
import { Tournament } from "../../../domain/entities/Tournaments";
import { AdminFilters } from "../../../domain/dtos/Team.dto";


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
