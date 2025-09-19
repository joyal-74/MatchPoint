import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IPlayerRepository } from "app/repositories/interfaces/IPlayerRepository";
import { IManagerRepository } from "app/repositories/interfaces/IManagerRepository";

export class DeleteUnverifiedUsers {
    constructor(
        private userRepo: IUserRepository,
        private playerRepo: IPlayerRepository,
        private managerRepo: IManagerRepository
    ) { }

    async execute(): Promise<number> {
        const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hrs ago
        const unverifiedUsers = await this.userRepo.findUnverifiedUsers(threshold);

        for (const user of unverifiedUsers) {
            await this.userRepo.deleteById(user._id);

            if (user.role === "player") {
                await this.playerRepo.deleteByUserId(user._id);
            } else if (user.role === "manager") {
                await this.managerRepo.deleteByUserId(user._id);
            }
        }

        return unverifiedUsers.length;
    }
}