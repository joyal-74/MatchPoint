import { inject, injectable } from "tsyringe";
import { IGetUsersByRole } from "../../repositories/interfaces/admin/IAdminUsecases";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { ILogger } from "../../providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";


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
