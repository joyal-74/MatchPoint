import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUpdatePlayerFields } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { IPlayerService } from "../../services/player/IPlayerService.js";
import { ILogger } from "../../providers/ILogger.js";
import { PlayerProfileFieldDTO, PlayerProfileResponse } from "../../../domain/dtos/Player.dto.js";
import { validatePlayerSportsFields } from "../../../domain/validators/PlayerFieldValidators.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { PlayerMapper } from "../../mappers/PlayerMapper.js";


@injectable()
export class UpdatePlayerFields implements IUpdatePlayerFields {
    constructor(
        @inject(DI_TOKENS.PlayerService) private _playerService: IPlayerService,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(updateData: PlayerProfileFieldDTO): Promise<PlayerProfileResponse> {

        const validData = validatePlayerSportsFields(updateData);

        if (!validData.userId) {
            this._logger.warn("[UpdatePlayerProfile] Missing user ID in update data");
            throw new NotFoundError("UserId not found");
        }

        this._logger.info("[UpdatePlayerProfile] Valid data passed validation");

        const updatedPlayer = await this._playerService.updatePlayerSportProfile(validData._id, validData);
        if(!updatedPlayer) throw new NotFoundError('Player Not found')

        this._logger.info("[UpdatePlayerProfile] Player profile successfully updated");

        return PlayerMapper.toProfileResponseDTO(updatedPlayer);
    }
}
