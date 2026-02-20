import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ISettingsRepository } from "../../repositories/interfaces/shared/ISettingsRepo.js";
import { IPasswordHasher } from "../../providers/IPasswordHasher.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";


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