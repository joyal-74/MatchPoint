import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { PlayerMapper } from "app/mappers/PlayerMapper";
import { ILogger } from "app/providers/ILogger";
import { IPlayerService } from "app/services/player/IPlayerService";
import { IUpdatePlayerFields } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { PlayerProfileFieldDTO, PlayerProfileResponse } from "domain/dtos/Player.dto";
import { NotFoundError } from "domain/errors";
import { validatePlayerSportsFields } from "domain/validators/PlayerFieldValidators";

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