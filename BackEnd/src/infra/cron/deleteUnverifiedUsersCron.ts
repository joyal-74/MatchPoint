import { IScheduler } from "app/repositories/interfaces/IScheduler";
import { DeleteUnverifiedUsers } from "app/usecases/authentication/DeleteUnverifiedUsers.ts";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/IPlayerRepository";
import { IManagerRepository } from "app/repositories/interfaces/IManagerRepository";
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