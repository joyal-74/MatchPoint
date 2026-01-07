import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { IGetManagersUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";

@injectable()
export class GetAllManagers implements IGetManagersUsecase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams) {
        this._logger.info("Fetching all managers");

        // Fetch managers from db
        const { users, totalCount } = await this._userRepository.findAllManagers(params);

        this._logger.info(`Found ${totalCount} managers`);

        return { users, totalCount };
    }
}