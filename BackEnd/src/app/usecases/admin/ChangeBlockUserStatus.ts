import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IChangeUserBlockStatus, RoleResponseDTO } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { NotFoundError } from "../../../domain/errors/index.js";


@injectable()
export class ChangeBlockUserStatus implements IChangeUserBlockStatus {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, isActive: boolean): Promise<RoleResponseDTO> {
        this._logger.info(`Fetching userId -> ${userId}`);

        const user = await this._userRepository.update(userId, { isActive });
        if(!user){
            throw new NotFoundError('User not found')
        }

        this._logger.info(`User with ID ${userId} status changed to ${isActive}`);

        return user;
    }
}