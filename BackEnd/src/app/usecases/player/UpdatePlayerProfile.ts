import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IUpdatePlayerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository";
import { IPlayerService } from "../../services/player/IPlayerService";
import { IFileStorage } from "../../providers/IFileStorage";
import { ILogger } from "../../providers/ILogger";
import { PlayerProfileResponse, PlayerUpdateDTO } from "../../../domain/dtos/Player.dto";
import { File } from "../../../domain/entities/File";
import { NotFoundError } from "../../../domain/errors/index";
import { PlayerMapper } from "../../mappers/PlayerMapper";
import { validateUserProfileUpdata } from "../../../domain/validators/UserProfileUpdateValidator";



@injectable()
export class UpdatePlayerProfile implements IUpdatePlayerProfile {
    constructor(
        @inject(DI_TOKENS.PlayerService) private _playerService : IPlayerService,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(updateData: PlayerUpdateDTO, file?: File): Promise<PlayerProfileResponse> {

        const validData = validateUserProfileUpdata(updateData, file); 

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
