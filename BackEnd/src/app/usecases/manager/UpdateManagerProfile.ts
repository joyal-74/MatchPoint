import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ManagerMapper } from "app/mappers/ManagerMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { IUpdateManagerProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ManagerResponseDTO, ManagerUpdateDTO } from "domain/dtos/Manager.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

@injectable()
export class UpdateManagerProfile implements IUpdateManagerProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.FileStorage) private fileStorage: IFileStorage
    ) { }

    async execute(updateData: ManagerUpdateDTO, file?: File): Promise<ManagerResponseDTO> {
        const validData = validateManagerUpdate(updateData, file);

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
