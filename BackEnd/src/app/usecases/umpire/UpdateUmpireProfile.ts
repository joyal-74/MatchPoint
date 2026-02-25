import { inject, injectable } from "tsyringe";

import { File } from "../../../domain/entities/File";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IUpdateUmpireProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { IFileStorage } from "../../providers/IFileStorage";
import { UmpireResponseDTO, UmpireUpdateDTO } from "../../../domain/dtos/Umpire.dto";
import { NotFoundError } from "../../../domain/errors/index";
import { UserMapper } from "../../mappers/UserMapper";
import { validateUserProfileUpdata } from "../../../domain/validators/UserProfileUpdateValidator";


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
