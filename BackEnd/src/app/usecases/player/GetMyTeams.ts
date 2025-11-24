import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IGetMyTeamsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamDataSummary } from "domain/dtos/Team.dto";

export class GetMyTeamsUseCase implements IGetMyTeamsUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(userId: string, status: string): Promise<{ teams: TeamDataSummary[]; totalTeams: number; }> {
        this._logger.info(`Fetching teams with Id: ${userId}`);

        const { teams, totalTeams } = await this._teamRepo.findAllWithUserId(userId, status);

        this._logger.info(`Fetched ${teams.length} teams`);

        return { teams, totalTeams };
    }
};