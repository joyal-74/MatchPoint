import { ILogger } from "app/providers/ILogger";
import { AdminTableParams, IChangeTeamStatus } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { TeamStatus } from "domain/dtos/Team.dto";

export class ChangeTeamStatus implements IChangeTeamStatus {
    constructor(
        private _teamRepository: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(teamId: string, isBlocked:TeamStatus, params: AdminTableParams) {

        // Update team status

        await this._teamRepository.update(teamId, { status: isBlocked });
        this._logger.info(`User with ID ${teamId} status changed to ${isBlocked}`);

        const result = await this._teamRepository.findAllTeams(params);
        const teams = result.teams;
        const totalCount = result.totalCount;
        this._logger.info(`Viewers count: ${teams.length}`);

        return { teams, totalCount };
    }
}