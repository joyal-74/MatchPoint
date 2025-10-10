import { UserMapper } from "app/mappers/UserMapper";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { NotFoundError } from "domain/errors";
import { ILogger } from "app/providers/ILogger";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { IGetViewerProfile } from "app/repositories/interfaces/IUserProfileRepository";

export class GetViewerProfile implements IGetViewerProfile {
    constructor(
        private _userRepo: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(userId: string): Promise<UserResponseDTO> {
        this._logger.info(`Fetching User profile for ID: ${userId}`);

        const User = await this._userRepo.findById(userId);
        if (!User) {
            this._logger.error(`User profile not found for ID: ${userId}`);
            throw new NotFoundError("User account not found");
        }

        const responseDTO = UserMapper.toProfileResponseDTO(User);
        this._logger.info(`User profile fetched successfully for ID: ${userId}`);

        return responseDTO;
    }
}
