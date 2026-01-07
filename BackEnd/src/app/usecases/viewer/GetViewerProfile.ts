import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { UserMapper } from "app/mappers/UserMapper";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { NotFoundError } from "domain/errors";
import { ILogger } from "app/providers/ILogger";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { IGetViewerProfile } from "app/repositories/interfaces/usecases/IUserProfileRepository";

@injectable()
export class GetViewerProfile implements IGetViewerProfile {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
