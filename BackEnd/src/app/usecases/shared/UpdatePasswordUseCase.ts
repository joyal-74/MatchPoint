import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ISettingsRepository } from "app/repositories/interfaces/shared/ISettingsRepo";
import { BadRequestError, NotFoundError } from "domain/errors";

@injectable()
export class UpdatePasswordUseCase {
    constructor(
        @inject(DI_TOKENS.SettingsRepository) private _settingsRepo: ISettingsRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
    ) {}

    async execute(userId: string, currentPassword: string, newPassword: string): Promise<string> {
        const user = await this._settingsRepo.findById(userId);
        
        if (!user) throw new NotFoundError("User not found");

        const isMatch = await this._passwordHasher.comparePasswords(currentPassword, user.password);
        if (!isMatch) throw new BadRequestError("Current password is incorrect");

        // 2. Hash the new password
        const newHash = await this._passwordHasher.hashPassword(newPassword);

        // 3. Persist
        const success = await this._settingsRepo.updatePasswordHash(userId, newHash);
        
        if (!success) throw new BadRequestError("Failed to update password");
        
        return "Password updated successfully";
    }
}