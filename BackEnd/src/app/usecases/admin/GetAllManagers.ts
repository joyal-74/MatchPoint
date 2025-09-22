import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { ILogger } from "app/providers/ILogger"; 
import { GetAllUsersParams } from "./GetAllViewers";

export class GetAllManagers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(params : GetAllUsersParams): Promise<ManagersResponseDTO[]> {
        this.logger.info("Fetching all managers");

        const managers = await this.userRepository.findAllManagers(params);

        this.logger.info(`Found ${managers.length} managers`);

        return managers;
    }
}