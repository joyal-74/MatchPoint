import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IGetViewerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { UserResponseDTO } from "../../../domain/dtos/User.dto.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { UserMapper } from "../../mappers/UserMapper.js";


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
