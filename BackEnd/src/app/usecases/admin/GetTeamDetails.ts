import { TeamMapper } from "app/mappers/TeamMappers";
import { ILogger } from "app/providers/ILogger";
import { IGetTeamDetails } from "app/repositories/interfaces/admin/IAdminUsecases";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { TeamDataFull } from "domain/dtos/Team.dto";
import { NotFoundError } from "domain/errors";


export class GetTeamDetails implements IGetTeamDetails {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
    ) { }

    async execute(playerId: string): Promise<TeamDataFull> {
        const team = await this._teamRepo.findById(playerId);

        if (!team) {
            this._logger.warn(`Team not found for ID: ${playerId}`);
            throw new NotFoundError("Manager not found");
        }

        const teamDetails = TeamMapper.toTeamDTO(team);
        this._logger.info(`Fetched details of team: ${team.name}`);

        return teamDetails;
    }
}