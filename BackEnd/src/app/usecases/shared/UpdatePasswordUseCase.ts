import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ISettingsRepository } from "app/repositories/interfaces/shared/ISettingsRepo";
import { BadRequestError, NotFoundError } from "domain/errors";

export class UpdatePasswordUseCase {
    constructor(
        private settingsRepo: ISettingsRepository,
        private passwordHasher: IPasswordHasher,
    ) {}

    async execute(userId: string, currentPassword: string, newPassword: string): Promise<string> {
        const user = await this.settingsRepo.findById(userId);
        
        if (!user) throw new NotFoundError("User not found");

        const isMatch = await this.passwordHasher.comparePasswords(currentPassword, user.password);
        if (!isMatch) throw new BadRequestError("Current password is incorrect");

        // 2. Hash the new password
        const newHash = await this.passwordHasher.hashPassword(newPassword);

        // 3. Persist
        const success = await this.settingsRepo.updatePasswordHash(userId, newHash);
        
        if (!success) throw new BadRequestError("Failed to update password");
        
        return "Password updated successfully";
    }
}