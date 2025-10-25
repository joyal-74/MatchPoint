import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { UserResponseDTO } from "domain/dtos/User.dto";

export class GetAllPlayers {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        this._logger.info("Fetching all players");

        // Fetch players from db
        const { totalCount, users } = await this._userRepository.findAllPlayers(params);

        this._logger.info(`Found ${totalCount} players`);

        return { users, totalCount };
    }
}