import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ISettingsRepository } from "../../repositories/interfaces/shared/ISettingsRepo";
import { IPasswordHasher } from "../../providers/IPasswordHasher";
import { ILogger } from "../../providers/ILogger";
import { NotFoundError } from "../../../domain/errors/index";

@injectable()
export class VerifyPasswordUseCase {
    constructor(
        @inject(DI_TOKENS.SettingsRepository) private _settingsRepo: ISettingsRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) {}

    async execute(userId: string, passwordAttempt: string): Promise<boolean> {
        this._logger.info(`Password verification attempt for userId: ${userId}`);

        const user = await this._settingsRepo.findById(userId);
        
        if (!user) {
            this._logger.warn(`Password verification failed: User not found for userId: ${userId}`);
            throw new NotFoundError("User not found");
        }

        const isMatch = await this._passwordHasher.comparePasswords(passwordAttempt, user.password);

        if (!isMatch) {
            this._logger.warn(`Invalid password attempt for userId: ${userId}`);
            return false;
        }

        this._logger.info(`Password successfully verified for userId: ${userId}`);
        return true;
    }
}
