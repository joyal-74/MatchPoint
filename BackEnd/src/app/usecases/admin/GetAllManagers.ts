import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { ILogger } from "app/providers/ILogger"; 

export class GetAllManagers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(): Promise<ManagersResponseDTO[]> {
        this.logger.info("Fetching all managers");

        const managers = await this.userRepository.findAllManagers("manager");

        this.logger.info(`Found ${managers.length} managers`);

        return managers;
    }
}