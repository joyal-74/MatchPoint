import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ITeamRepository } from "../../repositories/interfaces/shared/ITeamRepository";
import { ILogger } from "../../providers/ILogger";
import { TeamDataSummary } from "../../../domain/dtos/Team.dto";
import { IGetUserTeamsUseCase } from "../../repositories/interfaces/usecases/ITeamUsecaseRepository";


@injectable()
export class GetUserTeamsUseCase implements IGetUserTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, role: string): Promise<{ teams: TeamDataSummary[], totalTeams: number }> {
        this._logger.info(`Fetching teams}`);
        const { teams, totalTeams } = await this._teamRepo.findUserTeams(userId, role);

        this._logger.info(`Fetched ${teams.length} teams`);

        return { teams, totalTeams };
    }
} 
