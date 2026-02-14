import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUpdateViewerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IFileStorage } from "../../providers/IFileStorage.js";
import { UserResponseDTO, UserUpdateDTO } from "../../../domain/dtos/User.dto.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { File } from "../../../domain/entities/File.js";
import { validateUserProfileUpdata } from "../../../domain/validators/UserProfileUpdateValidator.js";



@injectable()
export class UpdateViewerProfile implements IUpdateViewerProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage
    ) { }

    async execute(update: UserUpdateDTO, file?: File): Promise<UserResponseDTO> {
        const validData = validateUserProfileUpdata(update, file);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const viewer = await this._userRepo.update(validData._id, validData);
        if (!viewer) {
            throw new NotFoundError('Viewer not found')
        }
        return UserMapper.toProfileResponseDTO(viewer)
    }
}