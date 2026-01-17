import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { ILogger } from "app/providers/ILogger";

@injectable()
export class DeleteUnverifiedUsers {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(): Promise<number> {
        const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
        this._logger.info("Deleting unverified users older than 24 hours", { threshold });

        const unverifiedUsers = await this._userRepository.findUnverifiedUsersForDeletion(threshold);
        this._logger.info(`Found ${unverifiedUsers.length} unverified users to delete`);

        for (const user of unverifiedUsers) {
            this._logger.info("Deleting user", { userId: user._id, role: user.role });

            await this._userRepository.deleteById(user._id);

            if (user.role === "player") {
                await this._playerRepo.deleteByUserId(user._id);
                this._logger.info("Deleted player data", { userId: user._id });
            } else if (user.role === "manager") {
                await this._managerRepo.deleteByUserId(user._id);
                this._logger.info("Deleted manager data", { userId: user._id });
            }
        }

        this._logger.info("Completed deletion of unverified users", { count: unverifiedUsers.length });
        return unverifiedUsers.length;
    }
}