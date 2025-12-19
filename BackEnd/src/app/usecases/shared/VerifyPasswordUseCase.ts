import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ISettingsRepository } from "app/repositories/interfaces/shared/ISettingsRepo";

export class VerifyPasswordUseCase {
    constructor(
        private settingsRepo: ISettingsRepository,
        private passwordHasher: IPasswordHasher,

    ) {}

    async execute(userId: string, passwordAttempt: string): Promise<boolean> {
        const user = await this.settingsRepo.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await this.passwordHasher.comparePasswords(passwordAttempt, user.password);
        return isMatch;
    }
}