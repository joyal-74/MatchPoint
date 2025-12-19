import { ISettingsRepository } from "app/repositories/interfaces/shared/ISettingsRepo";
import { BadRequestError } from "domain/errors";

export class UpdatePrivacyUseCase {
    constructor(
        private settingsRepo: ISettingsRepository
    ) { }

    async execute(userId: string, language: string, country: string): Promise<string> {
        const success = await this.settingsRepo.updatePrivacySettings(userId, language, country);

        if (!success) throw new BadRequestError("Failed to update privacy settings");

        return "Preferences updated successfully";
    }
}