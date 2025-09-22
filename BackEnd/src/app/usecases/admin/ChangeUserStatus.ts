import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { PlayerResponseDTO } from "domain/dtos/Player.dto";

type RoleResponseDTO = PlayerResponseDTO | UserResponseDTO;

export class ChangeUserStatus {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(role: string, userId: string, isActive : boolean): Promise<RoleResponseDTO> {
        this.logger.info(`Fetching ${role}`);

        const user = await this.userRepository.update(userId, { isActive });

        this.logger.info(`Found ${user?.first_name}`);

        if (role === "player") {
            return user as PlayerResponseDTO;
        } else {
            return user as UserResponseDTO;
        }
    }
}