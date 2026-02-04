import { inject, injectable } from "tsyringe";
import { IGetPlayerJoinedTeamsUseCase } from "../../repositories/interfaces/player/ITeamRepositoryUsecase.js";
import { IPlayerTeamServices } from "../../services/player/IPlayerTeamServices.js";
import { ILogger } from "../../providers/ILogger.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { PlayerTeamResponseDTO } from "../../../domain/dtos/Team.dto.js";


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
