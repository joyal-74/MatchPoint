import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { IGetPlayersUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";

export class GetAllPlayers implements IGetPlayersUsecase {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        this._logger.info("Fetching all players");

        const { totalCount, users } = await this._userRepository.findAllPlayers(params);

        this._logger.info(`Found ${totalCount} players`);

        return { users, totalCount };
    }
}