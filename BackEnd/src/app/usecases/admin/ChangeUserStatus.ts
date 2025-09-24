import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { GetAllUsersParams } from "./GetAllViewers";

type RoleResponseDTO = PlayersResponseDTO | UsersResponseDTO | ManagersResponseDTO;

export class ChangeUserStatus {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }> {
        this.logger.info(`Fetching ${role}`);
        this.logger.info(`Status ${isActive}`);
        this.logger.info(`Params: ${JSON.stringify(params)}`);

        await this.userRepository.update(userId, { isActive });
        this.logger.info(`User with ID ${userId} status changed to ${isActive}`);

        let users;
        let totalCount;
        if (role === "manager") {
            const result = await this.userRepository.findAllManagers(params);
            users = result.users;
            totalCount = result.totalCount;
            this.logger.info(`Managers count: ${users.length}`);
        } else if (role === "player") {
            const result = await this.userRepository.findAllPlayers(params);
            users = result.users;
            totalCount = result.totalCount;
            this.logger.info(`Players count: ${users.length}`);
        } else {
            const result = await this.userRepository.findAllViewers(params);
            users = result.users;
            totalCount = result.totalCount;
            this.logger.info(`Viewers count: ${users.length}`);
        }

        return { users, totalCount };

    }
}