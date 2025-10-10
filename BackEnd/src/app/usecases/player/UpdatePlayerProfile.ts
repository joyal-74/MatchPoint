import { playerMapper } from "app/mappers/PlayerMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { IUpdatePlayerProfile } from "app/repositories/interfaces/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayerResponseDTO, PlayerUpdateDTO } from "domain/dtos/Player.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

export class UpdatePlayerProfile implements IUpdatePlayerProfile {
    constructor(
        private userRepo: IUserRepository,
        private fileStorage: IFileStorage
    ) { }

    async execute(update: PlayerUpdateDTO, file?: File): Promise<PlayerResponseDTO> {
        const validData = validateManagerUpdate(update, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            validData.logo = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const player = await this.userRepo.update(validData._id, validData);
        
        return playerMapper.toProfileResponseDTO(player)
    }
}
