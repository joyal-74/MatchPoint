import { User } from "../../../../domain/entities/User.js";

export interface ISettingsRepository {
    findById(userId: string): Promise<User | null>;
    updatePasswordHash(userId: string, newHash: string): Promise<boolean>;
    updatePrivacySettings(userId: string, language: string, country: string): Promise<boolean>;
}
