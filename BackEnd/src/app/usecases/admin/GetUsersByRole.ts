import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { IGetUsersByRole } from "app/repositories/interfaces/admin/IAdminUsecases";

@injectable()
export class GetUsersByRole implements IGetUsersByRole {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(role: string, params: GetAllUsersParams) {
        let result;

        switch (role) {
            case "manager":
                result = await this._userRepository.findAllManagers(params);
                break;
            case "player":
                result = await this._userRepository.findAllPlayers(params);
                break;
            default:
                result = await this._userRepository.findAllViewers(params);
        }

        this._logger.info(`${role}s count: ${result.users.length}`);
        return result;
    }
}