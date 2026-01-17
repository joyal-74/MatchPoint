import { inject, injectable } from "tsyringe";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { ILogger } from "app/providers/ILogger";
import { DI_TOKENS } from "domain/constants/Identifiers";

@injectable()
export class DeleteUnverifiedUsers {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepo: IPlayerRepository,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepo: IManagerRepository,
        @inject("ILogger") private _logger: ILogger
    ) { }

    async execute(): Promise<number> {
        const hoursLimit = parseInt(process.env.UNVERIFIED_USER_EXPIRY_HOURS || "24");
        const thresholdDate = new Date();
        thresholdDate.setHours(thresholdDate.getHours() - hoursLimit);

        const usersToDelete = await this._userRepo.findUnverifiedUsersForDeletion(thresholdDate);

        if (!usersToDelete.length) return 0;

        const playerIds = usersToDelete.filter(u => u.role === 'player').map(u => u._id.toString());

        const managerIds = usersToDelete.filter(u => u.role === 'manager').map(u => u._id.toString());

        const allUserIds = usersToDelete.map(u => u._id.toString());

        this._logger.info(`Cleaning up: ${playerIds.length} players, ${managerIds.length} managers.`);

        await Promise.all([
            playerIds.length ? this._playerRepo.deleteManyByUserIds(playerIds) : Promise.resolve(),
            managerIds.length ? this._managerRepo.deleteManyByUserIds(managerIds) : Promise.resolve(),
        ]);

        const deletedCount = await this._userRepo.deleteManyById(allUserIds);

        return deletedCount;
    }
}