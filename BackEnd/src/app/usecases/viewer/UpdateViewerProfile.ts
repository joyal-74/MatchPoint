import { IFileStorage } from "app/providers/IFileStorage";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UserResponseDTO, UserUpdateDTO } from "domain/dtos/User.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateViewerUpdate } from "domain/validators/ViewerUpdateValidators";

export class UpdateViewerProfile {
    constructor(
        private userRepo: IUserRepository,
        private fileStorage: IFileStorage
    ) { }

    async execute(update: UserUpdateDTO, file?: File): Promise<{ user: UserResponseDTO }> {
        const validData = validateViewerUpdate(update, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            validData.logo = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const viewer = await this.userRepo.update(validData._id, validData);
        const viewerDTO: UserResponseDTO= {
            _id: viewer._id,
            userId: viewer.userId,
            email: viewer.email,
            first_name: viewer.first_name,
            last_name: viewer.last_name,
            username: viewer.username,
            role: viewer.role,
            gender: viewer.gender,
            phone: viewer.phone,
            wallet: viewer.wallet,
            logo: viewer.logo ? this.fileStorage.getUrl(viewer.logo) : null
        };
        return { user: viewerDTO };
    }
}
