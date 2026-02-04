import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ISettingsRepository } from "../../repositories/interfaces/shared/ISettingsRepo.js";
import { BadRequestError } from "../../../domain/errors/index.js";


@injectable()
export class UpdatePrivacyUseCase {
    constructor(
        @inject(DI_TOKENS.SettingsRepository) private _settingsRepo: ISettingsRepository
    ) { }

    async execute(userId: string, language: string, country: string): Promise<string> {
        const success = await this._settingsRepo.updatePrivacySettings(userId, language, country);

        if (!success) throw new BadRequestError("Failed to update privacy settings");

        return "Preferences updated successfully";
    }
}
