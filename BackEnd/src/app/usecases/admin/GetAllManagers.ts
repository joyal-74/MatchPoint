import { inject, injectable } from "tsyringe";
import { IGetManagersUsecase } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { GetAllUsersParams } from "./GetAllViewers.js";
import { ILogger } from "../../providers/ILogger.js";


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
