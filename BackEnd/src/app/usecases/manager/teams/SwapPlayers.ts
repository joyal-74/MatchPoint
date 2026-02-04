import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../../domain/constants/Identifiers.js";
import { ITeamRepository } from "../../../repositories/interfaces/shared/ITeamRepository.js";
import { ISwapPlayers } from "../../../repositories/interfaces/usecases/ITeamUsecaseRepository.js";
import { ILogger } from "../../../providers/ILogger.js";
import { BadRequestError, NotFoundError } from "../../../../domain/errors/index.js";
import { playerStatus } from "../../../../domain/dtos/Team.dto.js";


@injectable()
export class SwapPlayers implements ISwapPlayers {
    constructor(
        @inject(DI_TOKENS.TeamRepository) private _teamRepo: ITeamRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(teamId: string, playerId: string, status: playerStatus): Promise<void> {
        if (!playerId || !teamId) {
            this._logger.warn("Missing required parameters", { teamId, playerId, status });
            throw new BadRequestError("playerId and teamId are required");
        }

        this._logger.info("Changing player playing status", { teamId, playerId, status });

        const updatedTeam = await this._teamRepo.playerPlayingStatus(teamId, playerId, status);

        if (!updatedTeam) {
            this._logger.error("Failed to update player status - Team or player not found", { teamId, playerId, status });
            throw new NotFoundError("Team or player not found");
        }

        this._logger.info("Player playing status updated successfully", { teamId, playerId, newStatus: status, });
    }
}
