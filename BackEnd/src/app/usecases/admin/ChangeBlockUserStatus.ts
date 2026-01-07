import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { IChangeUserBlockStatus, RoleResponseDTO } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";

@injectable()
export class ChangeBlockUserStatus implements IChangeUserBlockStatus {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, isActive: boolean): Promise<RoleResponseDTO> {
        this._logger.info(`Fetching userId -> ${userId}`);

        const user = await this._userRepository.update(userId, { isActive });

        this._logger.info(`User with ID ${userId} status changed to ${isActive}`);

        return user;
    }
}