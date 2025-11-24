import { PlayerMapper } from "app/mappers/PlayerMapper";
import { PlayerProfileResponse } from "domain/dtos/Player.dto";
import { NotFoundError } from "domain/errors";
import { ILogger } from "app/providers/ILogger";
import { IGetPlayerProfile } from "app/repositories/interfaces/shared/IUserProfileRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";

export class GetPlayerProfile implements IGetPlayerProfile {
    constructor(
        private _playerRepo: IPlayerRepository,
        private _logger: ILogger
    ) { }

    async execute(playerId: string): Promise<PlayerProfileResponse> {
        this._logger.info(`Fetching player profile for ID: ${playerId}`);

        const player = await this._playerRepo.findById(playerId);
        if (!player) {
            this._logger.error(`Player profile not found for ID: ${playerId}`);
            throw new NotFoundError("Player account not found");
        }

        const responseDTO = PlayerMapper.toProfileResponseDTO(player);
        this._logger.info(`Player profile fetched successfully for ID: ${playerId}`);

        return responseDTO;
    }
}
