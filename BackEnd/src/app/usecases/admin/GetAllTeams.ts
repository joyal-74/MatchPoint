import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetTeamsUsecase } from "../../repositories/interfaces/admin/IAdminUsecases";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { AdminFilters, TeamDataSummary } from "../../../domain/dtos/Team.dto";
import { ILogger } from "../../providers/ILogger";


@injectable()
export class GetAllTeams implements IGetTeamsUsecase {
    constructor(
        @inject(DI_TOKENS.TeamRepository)  private _teamRepository: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(params: AdminFilters): Promise<{ teams: TeamDataSummary[], totalCount: number }> {
        this._logger.info("Fetching all players");

        const { totalCount, teams } = await this._teamRepository.findAllTeams(params);

        this._logger.info(`Found ${totalCount} teams`);

        return { teams, totalCount };
    }
}
