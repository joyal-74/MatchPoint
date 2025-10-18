import { ILogger } from "app/providers/ILogger";
import { IPlayerTeamServices } from "app/providers/IPlayerTeamServices";
import { IGetAllMyTeamsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";
import { PlayerTeamResponseDTO } from "domain/dtos/Team.dto";

export class GetAllMyTeamsUseCase implements IGetAllMyTeamsUseCase {
    constructor(
        private _teamServices: IPlayerTeamServices,
        private _logger: ILogger
    ) { }

    async execute(userId: string): Promise<PlayerTeamResponseDTO> {
        this._logger.info(`Fetching teams with Id: ${userId}`);

        const { approvedTeams, totalApprovedTeams,
            pendingTeams, totalPendingTeams, } = await this._teamServices.findPlayerTeams(userId);

        this._logger.info(`Fetched all teams`);

        return {
            approvedTeams, totalApprovedTeams,
            pendingTeams, totalPendingTeams,
        };
    }
};