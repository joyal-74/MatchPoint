import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IFileStorage } from "app/providers/IFileStorage";
import { IUpdateUmpireProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { UmpireResponseDTO, UmpireUpdateDTO } from "domain/dtos/Umpire.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateUmpireUpdate } from "domain/validators/UmpireProfileValidator";
import { UserMapper } from "app/mappers/UserMapper";

@injectable()
export class UpdateUmpireProfile implements IUpdateUmpireProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.FileStorage) private fileStorage: IFileStorage
    ) { }

    async execute(updateData: UmpireUpdateDTO, file?: File): Promise<UmpireResponseDTO> {
        const validData = validateUmpireUpdate(updateData, file);

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
