import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IGetAllTeamsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { Filters, TeamData } from "domain/dtos/Team.dto";

export class FetchAllTeams implements IGetAllTeamsUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(filters: Filters): Promise<TeamData[]> {
        this._logger.info(`Fetching teams with filters: ${filters}`);

        const teams = await this._teamRepo.findAllWithFilters(filters);

        this._logger.info(`Fetched ${teams.length} teams`);

        return teams;
    }
} 