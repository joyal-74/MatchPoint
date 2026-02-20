import { inject, injectable } from "tsyringe";

import { File } from "../../../domain/entities/File.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUpdateUmpireProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IFileStorage } from "../../providers/IFileStorage.js";
import { UmpireResponseDTO, UmpireUpdateDTO } from "../../../domain/dtos/Umpire.dto.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { validateUserProfileUpdata } from "../../../domain/validators/UserProfileUpdateValidator.js";


@injectable()
export class UpdateUmpireProfile implements IUpdateUmpireProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.FileStorage) private fileStorage: IFileStorage
    ) { }

    async execute(updateData: UmpireUpdateDTO, file?: File): Promise<UmpireResponseDTO> {
        const validData = validateUserProfileUpdata(updateData, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const umpire = await this._userRepo.update(validData._id, validData);
        if(!umpire){
            throw new NotFoundError('Umpire not updated');
        }

        return UserMapper.toProfileResponseDTO(umpire);
    }
}