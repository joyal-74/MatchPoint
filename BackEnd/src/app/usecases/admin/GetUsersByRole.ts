import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { IGetUsersByRole } from "app/repositories/interfaces/admin/IAdminUsecases";

export class GetUsersByRole implements IGetUsersByRole {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
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