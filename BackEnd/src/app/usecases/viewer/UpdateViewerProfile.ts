import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { UserMapper } from "app/mappers/UserMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { IUpdateViewerProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { UserResponseDTO, UserUpdateDTO } from "domain/dtos/User.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateViewerUpdate } from "domain/validators/ViewerUpdateValidators";


@injectable()
export class UpdateViewerProfile implements IUpdateViewerProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage
    ) { }

    async execute(update: UserUpdateDTO, file?: File): Promise<UserResponseDTO> {
        const validData = validateViewerUpdate(update, file);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const viewer = await this._userRepo.update(validData._id, validData);
        return UserMapper.toProfileResponseDTO(viewer)
    }
}
