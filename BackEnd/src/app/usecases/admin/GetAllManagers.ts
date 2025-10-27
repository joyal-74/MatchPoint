import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { IGetManagersUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";

export class GetAllManagers implements IGetManagersUsecase {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams) {
        this._logger.info("Fetching all managers");

        // Fetch managers from db
        const { users, totalCount } = await this._userRepository.findAllManagers(params);

        this._logger.info(`Found ${totalCount} managers`);

        return { users, totalCount };
    }
}