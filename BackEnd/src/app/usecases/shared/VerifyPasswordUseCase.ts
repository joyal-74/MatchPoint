import { inject, injectable } from "tsyringe";

import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ISettingsRepository } from "app/repositories/interfaces/shared/ISettingsRepo";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { NotFoundError } from "domain/errors";

@injectable()
export class VerifyPasswordUseCase {
    constructor(
        @inject(DI_TOKENS.SettingsRepository) private _settingsRepo: ISettingsRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,

    ) {}

    async execute(userId: string, passwordAttempt: string): Promise<boolean> {
        const user = await this._settingsRepo.findById(userId);
        
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isMatch = await this._passwordHasher.comparePasswords(passwordAttempt, user.password);
        return isMatch;
    }
}