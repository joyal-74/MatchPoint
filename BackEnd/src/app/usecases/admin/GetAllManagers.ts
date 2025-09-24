import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";

export class GetAllManagers {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: ManagersResponseDTO[]; totalCount: number }> {
        this._logger.info("Fetching all managers");

        // Fetch managers from db
        const { users, totalCount } = await this._userRepository.findAllManagers(params);

        this._logger.info(`Found ${totalCount} managers`);

        return { users, totalCount };
    }
}