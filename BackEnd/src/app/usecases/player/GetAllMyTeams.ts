import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IPlayerTeamServices } from "app/services/player/IPlayerTeamServices";
import { PlayerTeamResponseDTO } from "domain/dtos/Team.dto";
import { IGetPlayerJoinedTeamsUseCase } from "app/repositories/interfaces/player/ITeamRepositoryUsecase";

@injectable()
export class GetPlayerJoinedTeamsUseCase implements IGetPlayerJoinedTeamsUseCase {
    constructor(
        @inject(DI_TOKENS.PlayerTeamServices) private _teamServices: IPlayerTeamServices,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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