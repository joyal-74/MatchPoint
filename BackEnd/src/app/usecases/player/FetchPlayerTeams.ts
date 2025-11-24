import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IGetAllTeamsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { Filters, TeamDataSummary } from "domain/dtos/Team.dto";

export class FetchAllTeams implements IGetAllTeamsUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(filters: Filters): Promise<{teams : TeamDataSummary[], totalTeams : number}> {
        this._logger.info(`Fetching teams with filters: ${filters}`);

        const { teams, totalTeams } = await this._teamRepo.findAllWithFilters(filters);

        this._logger.info(`Fetched ${teams.length} teams`);

        return { teams, totalTeams };
    }
} 