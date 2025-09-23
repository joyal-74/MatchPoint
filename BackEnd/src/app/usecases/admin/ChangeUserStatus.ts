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

    async execute(role: string, userId: string, isActive : boolean, params: GetAllUsersParams): Promise<RoleResponseDTO[]> {
        this.logger.info(`Fetching ${role}`);

        await this.userRepository.update(userId, { isActive });
        this.logger.info(`User with ID ${userId} status changed to ${isActive}`);

        if (role === "manager") {
            const users = await this.userRepository.findAllManagers(params);
            return users as ManagersResponseDTO[];
        } else if (role === "player") {
            const users = await this.userRepository.findAllPlayers(params);
            return users as PlayersResponseDTO[];
        } else {
            const users = await this.userRepository.findAllViewers(params);
            return users as UsersResponseDTO[];
        }
    }
}