import { IScheduler } from "app/repositories/interfaces/providers/IScheduler";
import { DeleteUnverifiedUsers } from "app/usecases/auth/DeleteUnverifiedUsers.ts";
import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { ILogger } from "app/providers/ILogger";

export const deleteUnverifiedUsersCron = (
    scheduler: IScheduler,
    userRepo: IUserRepository,
    playerRepo: IPlayerRepository,
    managerRepo: IManagerRepository,
    logger: ILogger
) => {
    const deleteUnverifiedUsers = new DeleteUnverifiedUsers(
        userRepo,
        playerRepo,
        managerRepo,
        logger
    );

    scheduler.schedule("0 * * * *", async () => {
        const count = await deleteUnverifiedUsers.execute();
        console.log(`Deleted ${count} unverified users`);
    });
};