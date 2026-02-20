import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ManagerResponseDTO, ManagerUpdateDTO } from "../../../domain/dtos/Manager.dto.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IFileStorage } from "../../providers/IFileStorage.js";
import { validateUserProfileUpdata } from "../../../domain/validators/UserProfileUpdateValidator.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { ManagerMapper } from "../../mappers/ManagerMapper.js";
import { IUpdateManagerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { File } from "../../../domain/entities/File.js";


@injectable()
export class UpdateManagerProfile implements IUpdateManagerProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.FileStorage) private fileStorage: IFileStorage
    ) { }

    async execute(updateData: ManagerUpdateDTO, file?: File): Promise<ManagerResponseDTO> {
        const validData = validateUserProfileUpdata(updateData, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const manager = await this._userRepo.update(validData._id, validData);
        if(!manager){
            throw new NotFoundError('Manager not updated');
        }

        return ManagerMapper.toProfileResponseDTO(manager);
    }
}