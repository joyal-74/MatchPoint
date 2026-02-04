import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository.js";
import { AdminTableParams, IChangeTeamStatus } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { TeamStatus } from "../../../domain/dtos/Team.dto.js";
import { ILogger } from "../../providers/ILogger.js";


@injectable()
export class AdminChangeTeamStatus implements IChangeTeamStatus {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepository: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(teamId: string, isBlocked:TeamStatus, params: AdminTableParams) {

        // Update team status

        await this._teamRepository.update(teamId, { status: isBlocked });
        this._logger.info(`User with ID ${teamId} status changed to ${isBlocked}`);

        const result = await this._teamRepository.findAllTeams(params);
        const teams = result.teams;
        const totalCount = result.totalCount;
        this._logger.info(`Team count: ${teams.length}`);

        return { teams, totalCount };
    }
}
