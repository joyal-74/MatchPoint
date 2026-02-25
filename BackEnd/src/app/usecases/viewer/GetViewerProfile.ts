import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IGetViewerProfile } from "../../repositories/interfaces/usecases/IUserProfileRepository";
import { ILogger } from "../../providers/ILogger";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { UserResponseDTO } from "../../../domain/dtos/User.dto";
import { NotFoundError } from "../../../domain/errors/index";
import { UserMapper } from "../../mappers/UserMapper";


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
