import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { ILogger } from "app/providers/ILogger";

export class GetAllViewers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(): Promise<UsersResponseDTO[]> {
        this.logger.info("Fetching all viewers");

        const viewers = await this.userRepository.findAllViewers("viewer");

        this.logger.info(`Found ${viewers.length} viewers`);

        return viewers;
    }
}