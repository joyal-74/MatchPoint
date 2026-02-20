import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ISettingsRepository } from "../../repositories/interfaces/shared/ISettingsRepo.js";
import { BadRequestError } from "../../../domain/errors/index.js";
import { ILogger } from "../../providers/ILogger.js";


@injectable()
export class UpdatePrivacyUseCase {
    constructor(
        @inject(DI_TOKENS.SettingsRepository) private _settingsRepo: ISettingsRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, language: string, country: string): Promise<string> {
        this._logger.info(`Updating privacy settings for ${userId}`)
        
        const success = await this._settingsRepo.updatePrivacySettings(userId, language, country);
        
        this._logger.info(`Successfully updated privacy settings for ${userId}`)

        if (!success) throw new BadRequestError("Failed to update privacy settings");

        return "Preferences updated successfully";
    }
}