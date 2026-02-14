import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { UserResponseDTO } from "../../../domain/dtos/User.dto.js";
import { ILogger } from "../../providers/ILogger.js";


export interface GetAllUsersParams {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}

@injectable()
export class GetAllViewers {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        this._logger.info("Fetching all viewers");

        // Fetch players from db
        const { users, totalCount } = await this._userRepository.findAllViewers(params);

        this._logger.info(`Found ${totalCount} viewers`);

        return { users, totalCount };
    }
}
