import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { IGetMyTeamsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { TeamDataSummary } from "domain/dtos/Team.dto";

@injectable()
export class GetMyTeamsUseCase implements IGetMyTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, status: string): Promise<{ teams: TeamDataSummary[]; totalTeams: number; }> {
        this._logger.info(`Fetching teams with Id: ${userId}`);

        const { teams, totalTeams } = await this._teamRepo.findAllWithUserId(userId, status);

        this._logger.info(`Fetched ${teams.length} teams`);

        return { teams, totalTeams };
    }
};