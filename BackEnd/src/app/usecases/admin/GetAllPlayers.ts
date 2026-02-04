import { inject, injectable } from "tsyringe";
import { IGetPlayersUsecase } from "../../repositories/interfaces/admin/IAdminUsecases.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { GetAllUsersParams } from "./GetAllViewers.js";
import { UserResponseDTO } from "../../../domain/dtos/User.dto.js";
import { ILogger } from "../../providers/ILogger.js";


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
