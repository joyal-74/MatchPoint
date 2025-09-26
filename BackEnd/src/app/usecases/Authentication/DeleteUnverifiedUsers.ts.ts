import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/IPlayerRepository";
import { IManagerRepository } from "app/repositories/interfaces/IManagerRepository";
import { ILogger } from "app/providers/ILogger";

export class DeleteUnverifiedUsers {
    constructor(
        private _userRepo: IUserRepository,
        private _playerRepo: IPlayerRepository,
        private _managerRepo: IManagerRepository,
        private _logger: ILogger
    ) { }

    async execute(): Promise<number> {
        // Calculate threshold date (24 hours ago)
        const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
        this._logger.info("Deleting unverified users older than 24 hours", { threshold });

        // Fetch all unverified users before the threshold
        const unverifiedUsers = await this._userRepo.findUnverifiedUsers(threshold);
        this._logger.info(`Found ${unverifiedUsers.length} unverified users to delete`);

        // Loop through each unverified user and delete from all relevant collections
        for (const user of unverifiedUsers) {
            this._logger.info("Deleting user", { userId: user._id, role: user.role });

            await this._userRepo.deleteById(user._id);

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
