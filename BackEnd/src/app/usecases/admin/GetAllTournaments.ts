import { ILogger } from "app/providers/ILogger";
import { IGetTournamentUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITournamentRepository } from "app/repositories/interfaces/shared/ITournamentRepository";
import { AdminFilters} from "domain/dtos/Team.dto";
import { Tournament } from "domain/entities/Tournaments";

export class GetAllTournaments implements IGetTournamentUsecase {
    constructor(
        private _tournamnetRepository: ITournamentRepository,
        private _logger: ILogger
    ) { }

    async execute(params: AdminFilters): Promise<{ tournaments: Tournament[], total: number }> {
        this._logger.info("Fetching all players");

        const { total, tournaments } = await this._tournamnetRepository.findByFilters(params);

        this._logger.info(`Found ${total} teams`);

        return { tournaments, total };
    }
}