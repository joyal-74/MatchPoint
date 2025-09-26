import { IFileStorage } from "app/providers/IFileStorage";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagerResponseDTO, ManagerUpdateDTO } from "domain/dtos/Manager.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

export class UpdateManagerProfile {
    constructor(
        private userRepo: IUserRepository,
        private fileStorage: IFileStorage
    ) { }

    async execute(update: ManagerUpdateDTO, file?: File): Promise<{ user: ManagerResponseDTO }> {
        const validData = validateManagerUpdate(update, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            validData.logo = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const manager = await this.userRepo.update(validData._id, validData);
        const managerDTO: ManagerResponseDTO = {
            _id: manager._id,
            userId: manager.userId,
            email: manager.email,
            first_name: manager.first_name,
            last_name: manager.last_name,
            username: manager.username,
            role: manager.role,
            gender: manager.gender,
            phone: manager.phone,
            wallet: manager.wallet,
            logo: manager.logo ? this.fileStorage.getUrl(manager.logo) : null
        };
        return { user: managerDTO };
    }
}
