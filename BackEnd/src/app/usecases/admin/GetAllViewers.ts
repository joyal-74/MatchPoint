import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { ILogger } from "app/providers/ILogger";

export interface GetAllUsersParams {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}

export class GetAllViewers {
    constructor(
        private userRepository: IUserRepository,
        private logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<UsersResponseDTO[]> {
        this.logger.info("Fetching all viewers");

        const data = await this.userRepository.findAllViewers(params);

        this.logger.info(`Found ${data.length} viewers`);

        return data;
    }
}