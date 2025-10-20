import { PlayerMapper } from "app/mappers/PlayerMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { ILogger } from "app/providers/ILogger";
import { IPlayerService } from "app/providers/IPlayerService";
import { IUpdatePlayerProfile } from "app/repositories/interfaces/IUserProfileRepository";
import { PlayerProfileResponse, PlayerUpdateDTO } from "domain/dtos/Player.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

export class UpdatePlayerProfile implements IUpdatePlayerProfile {
    constructor(
        private _playerService : IPlayerService,
        private _fileStorage: IFileStorage,
        private _logger: ILogger,
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
            console.log(fileKey)
            validData.profileImage = fileKey;
        }

        const {userId, ...data} = validData

        const player = await this._playerService.updateUserProfile(userId, data);
        if(!player) throw new NotFoundError('Player not found')

        this._logger.info("Player profile successfully updated")

        return PlayerMapper.toProfileResponseDTO(player)
    }
}