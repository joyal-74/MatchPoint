import { ILogger } from "app/providers/ILogger";
import { IGetTeamsUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { AdminFilters, TeamDataSummary } from "domain/dtos/Team.dto";

export class GetAllTeams implements IGetTeamsUsecase {
    constructor(
        private _teamRepository: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(params: AdminFilters): Promise<{ teams: TeamDataSummary[], totalCount: number }> {
        this._logger.info("Fetching all players");

        const { totalCount, teams } = await this._teamRepository.findAllTeams(params);

        this._logger.info(`Found ${totalCount} teams`);

        return { teams, totalCount };
    }
}