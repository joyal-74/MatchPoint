import { ILogger } from "app/providers/ILogger";
import { IChangeUserBlockStatus, RoleResponseDTO } from "app/repositories/interfaces/admin/IAdminUsecases";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";

export class ChangeBlockUserStatus implements IChangeUserBlockStatus {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(userId: string, isActive: boolean): Promise<RoleResponseDTO> {
        this._logger.info(`Fetching userId -> ${userId}`);

        const user = await this._userRepository.update(userId, { isActive });

        this._logger.info(`User with ID ${userId} status changed to ${isActive}`);

        return user;
    }
}