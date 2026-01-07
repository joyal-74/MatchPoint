import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { GetAllUsersParams } from "./GetAllViewers";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { IGetPlayersUsecase } from "app/repositories/interfaces/admin/IAdminUsecases";

@injectable()
export class GetAllPlayers implements IGetPlayersUsecase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        this._logger.info("Fetching all players");

        const { totalCount, users } = await this._userRepository.findAllPlayers(params);

        this._logger.info(`Found ${totalCount} players`);

        return { users, totalCount };
    }
}