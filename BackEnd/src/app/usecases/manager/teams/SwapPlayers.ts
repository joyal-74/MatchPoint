import { ILogger } from "app/providers/ILogger";
import { ITeamRepository } from "app/repositories/interfaces/shared/ITeamRepository";
import { ISwapPlayers } from "app/repositories/interfaces/usecases/ITeamUsecaseRepository";
import { playerStatus } from "domain/dtos/Team.dto";
import { BadRequestError, NotFoundError } from "domain/errors";

export class SwapPlayers implements ISwapPlayers {
    constructor(
        private _teamRepo: ITeamRepository,
        private _logger: ILogger
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