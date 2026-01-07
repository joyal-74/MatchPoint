import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IChangeTeamDetailStatus } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { TeamStatus } from "domain/dtos/Team.dto";

@injectable()
export class ChangeTeamDetailStatus implements IChangeTeamDetailStatus {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepository: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(teamId: string, status:TeamStatus) {

        const team = await this._teamRepository.update(teamId, { status });
        this._logger.info(`User with ID ${teamId} status changed to ${status}`);

        return team;
    }
}