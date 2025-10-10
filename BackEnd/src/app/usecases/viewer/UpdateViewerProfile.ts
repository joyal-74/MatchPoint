import { UserMapper } from "app/mappers/UserMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { IUpdateViewerProfile } from "app/repositories/interfaces/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UserResponseDTO, UserUpdateDTO } from "domain/dtos/User.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateViewerUpdate } from "domain/validators/ViewerUpdateValidators";

export class UpdateViewerProfile implements IUpdateViewerProfile {
    constructor(
        private userRepo: IUserRepository,
        private fileStorage: IFileStorage
    ) { }

    async execute(update: UserUpdateDTO, file?: File): Promise<UserResponseDTO> {
        const validData = validateViewerUpdate(update, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            console.log(fileKey)
            validData.logo = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const viewer = await this.userRepo.update(validData._id, validData);
        return UserMapper.toProfileResponseDTO(viewer)
    }
}
