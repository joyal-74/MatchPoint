import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { PlayerMapper } from "app/mappers/PlayerMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { ILogger } from "app/providers/ILogger";
import { IPlayerService } from "app/services/player/IPlayerService";
import { IUpdatePlayerProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { PlayerProfileResponse, PlayerUpdateDTO } from "domain/dtos/Player.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

@injectable()
export class UpdatePlayerProfile implements IUpdatePlayerProfile {
    constructor(
        @inject(DI_TOKENS.PlayerService) private _playerService : IPlayerService,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(updateData: PlayerUpdateDTO, file?: File): Promise<PlayerProfileResponse> {

        const validData = validateManagerUpdate(updateData, file); 

        if (!validData.userId) {
            this._logger.warn("[UpdatePlayerProfile] Missing user ID in update data");
            throw new NotFoundError("UserId not found");
        }

        this._logger.info("[UpdatePlayerProfile] Valid data passed validation");

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

        const {userId, ...data} = validData

        const player = await this._playerService.updateUserProfile(userId, data);
        if(!player) throw new NotFoundError('Player not found')

        this._logger.info("Player profile successfully updated")

        return PlayerMapper.toProfileResponseDTO(player)
    }
}