import { ManagerMapper } from "app/mappers/ManagerMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { IUpdateManagerProfile } from "app/repositories/interfaces/IManagerProfileRepository";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagerResponseDTO, ManagerUpdateDTO } from "domain/dtos/Manager.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

export class UpdateManagerProfile implements IUpdateManagerProfile {
    constructor(
        private userRepo: IUserRepository,
        private fileStorage: IFileStorage
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

        const manager = await this.userRepo.update(validData._id, validData);

        const managerDTO = ManagerMapper.toProfileResponseDTO(manager, this.fileStorage);

        return managerDTO;
    }
}
