// core/usecases/user/DeleteUnverifiedUsers.ts
import type { IUserRepository } from "@core/domain/repositories/interfaces/IUserRepository"; 

export class DeleteUnverifiedUsers {
    constructor(private userRepo: IUserRepository) {}

    async execute(): Promise<number> {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago
        return await this.userRepo.deleteUnverifiedUsersBefore(cutoff);
    }
}
