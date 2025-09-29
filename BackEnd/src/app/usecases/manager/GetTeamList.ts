import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/ITeamRepository";
import { IGetAllTeamsUseCase } from "app/repositories/interfaces/manager/ITeamUsecaseRepository";
import { TeamData } from "domain/dtos/Team.dto";

export class GetAllTeamsUseCase implements IGetAllTeamsUseCase {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(managerId: string): Promise<TeamData[]> {
        this._logger.info(`Finding all teams for manager ${managerId}`);
        const teams = await this._teamRepo.findAll(managerId);

        this._logger.info(`Total ${teams.length} teams found`);
        return teams;
    }
}