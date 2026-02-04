import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetPlayerTeamsUseCase } from "../../repositories/interfaces/player/ITeamRepositoryUsecase.js";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { Filters, TeamDataSummary } from "../../../domain/dtos/Team.dto.js";


@injectable()
export class GetPlayerTeamsUseCase implements IGetPlayerTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(filters: Filters): Promise<{ teams: TeamDataSummary[], totalTeams: number }> {
        this._logger.info(`Fetching teams with filters: ${JSON.stringify(filters)}`);
        const { teams, totalTeams } = await this._teamRepo.findAllWithFilters(filters);

        this._logger.info(`Fetched ${teams.length} teams`);

        return { teams, totalTeams };
    }
} 
