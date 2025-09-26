import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { ILogger } from "app/providers/ILogger";

export interface GetAllUsersParams {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}

export class GetAllViewers {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: UsersResponseDTO[], totalCount: number }> {
        this._logger.info("Fetching all viewers");

        // Fetch players from db
        const { users, totalCount } = await this._userRepository.findAllViewers(params);

        this._logger.info(`Found ${totalCount} viewers`);

        return { users, totalCount };
    }
}