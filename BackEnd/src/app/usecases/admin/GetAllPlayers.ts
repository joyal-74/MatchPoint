import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";

export class GetAllPlayers {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: PlayersResponseDTO[], totalCount: number }> {
        this._logger.info("Fetching all players");

        // Fetch players from db
        const { totalCount, users } = await this._userRepository.findAllPlayers(params);

        this._logger.info(`Found ${totalCount} players`);

        return { users, totalCount };
    }
}