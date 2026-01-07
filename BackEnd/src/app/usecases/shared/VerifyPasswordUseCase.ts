import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ISettingsRepository } from "app/repositories/interfaces/shared/ISettingsRepo";

@injectable()
export class VerifyPasswordUseCase {
    constructor(
        @inject(DI_TOKENS.SettingsRepository) private _settingsRepo: ISettingsRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,

    ) {}

    async execute(userId: string, passwordAttempt: string): Promise<boolean> {
        const user = await this._settingsRepo.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await this._passwordHasher.comparePasswords(passwordAttempt, user.password);
        return isMatch;
    }
}