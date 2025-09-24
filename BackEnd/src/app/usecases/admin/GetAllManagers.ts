import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";

export class GetAllManagers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: ManagersResponseDTO[]; totalCount: number }> {
        this.logger.info("Fetching all managers");

        const { users, totalCount } = await this.userRepository.findAllManagers(params);

        this.logger.info(`Found ${totalCount} managers`);

        return { users, totalCount };
    }
}