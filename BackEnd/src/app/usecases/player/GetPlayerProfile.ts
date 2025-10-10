import { playerMapper } from "app/mappers/PlayerMapper";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayerResponseDTO } from "domain/dtos/Player.dto";
import { NotFoundError } from "domain/errors";
import { ILogger } from "app/providers/ILogger";
import { IGetPlayerProfile } from "app/repositories/interfaces/IUserProfileRepository";

export class GetPlayerProfile implements IGetPlayerProfile {
    constructor(
        private _userRepo: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(playerId: string): Promise<PlayerResponseDTO> {
        this._logger.info(`Fetching player profile for ID: ${playerId}`);

        const player = await this._userRepo.findById(playerId);
        if (!player) {
            this._logger.error(`Player profile not found for ID: ${playerId}`);
            throw new NotFoundError("Player account not found");
        }

        const responseDTO = playerMapper.toProfileResponseDTO(player);
        this._logger.info(`Player profile fetched successfully for ID: ${playerId}`);

        return responseDTO;
    }
}
