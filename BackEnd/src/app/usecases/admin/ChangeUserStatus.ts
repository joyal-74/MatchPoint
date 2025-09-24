import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { GetAllUsersParams } from "./GetAllViewers";

type RoleResponseDTO = PlayersResponseDTO | UsersResponseDTO | ManagersResponseDTO;

export class ChangeUserStatus {
    constructor(
        private _userRepository: IUserRepository,
        private _logger: ILogger
    ) { }

    async execute(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }> {
        this._logger.info(`Fetching ${role}`);

        // Update user status
        await this._userRepository.update(userId, { isActive });
        this._logger.info(`User with ID ${userId} status changed to ${isActive}`);

        let users;
        let totalCount;

        // Fetch users based on role
        if (role === "manager") {
            const result = await this._userRepository.findAllManagers(params);
            users = result.users;
            totalCount = result.totalCount;
            this._logger.info(`Managers count: ${users.length}`);
        } else if (role === "player") {
            const result = await this._userRepository.findAllPlayers(params);
            users = result.users;
            totalCount = result.totalCount;
            this._logger.info(`Players count: ${users.length}`);
        } else {
            const result = await this._userRepository.findAllViewers(params);
            users = result.users;
            totalCount = result.totalCount;
            this._logger.info(`Viewers count: ${users.length}`);
        }

        return { users, totalCount };
    }
}