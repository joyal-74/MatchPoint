import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetPlayerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { IPlayerRepository } from "../../repositories/interfaces/player/IPlayerRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { PlayerProfileResponse } from "../../../domain/dtos/Player.dto.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { PlayerMapper } from "../../mappers/PlayerMapper.js";


@injectable()
export class GetPlayerProfile implements IGetPlayerProfile {
    constructor(
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
