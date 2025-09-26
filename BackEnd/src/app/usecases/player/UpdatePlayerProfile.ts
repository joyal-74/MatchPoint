import { IFileStorage } from "app/providers/IFileStorage";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayerResponseDTO, PlayerUpdateDTO } from "domain/dtos/Player.dto";
import { File } from "domain/entities/File";
import { NotFoundError } from "domain/errors";
import { validateManagerUpdate } from "domain/validators/ManagerUpdateValidator";

export class UpdatePlayerProfile {
    constructor(
        private userRepo: IUserRepository,
        private fileStorage: IFileStorage
    ) { }

    async execute(update: PlayerUpdateDTO, file?: File): Promise<{ user: PlayerResponseDTO }> {
        const validData = validateManagerUpdate(update, file);

        if (file) {
            const fileKey = await this.fileStorage.upload(file);
            validData.logo = fileKey;
        }

        if (!validData._id) {
            throw new NotFoundError("UserId not found");
        }

        const player = await this.userRepo.update(validData._id, validData);
        const playerDTO: PlayerResponseDTO = {
            _id: player._id,
            userId: player.userId,
            email: player.email,
            first_name: player.first_name,
            last_name: player.last_name,
            username: player.username,
            sport: player.sport as string,
            role: player.role,
            gender: player.gender,
            phone: player.phone,
            wallet: player.wallet,
            logo: player.logo ? this.fileStorage.getUrl(player.logo) : null
        };
        return { user: playerDTO };
    }
}
