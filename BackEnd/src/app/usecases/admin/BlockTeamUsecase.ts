import { ILogger } from "app/providers/ILogger";
import { IChangeTeamDetailStatus } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { TeamStatus } from "domain/dtos/Team.dto";

export class ChangeTeamDetailStatus implements IChangeTeamDetailStatus {
    constructor(
        private _teamRepository: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(teamId: string, status:TeamStatus) {

        const team = await this._teamRepository.update(teamId, { status });
        this._logger.info(`User with ID ${teamId} status changed to ${status}`);

        return team;
    }
}