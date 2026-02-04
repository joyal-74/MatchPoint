
import { ISettingsRepository } from "../../../app/repositories/interfaces/shared/ISettingsRepo.js"; 
import { User } from "../../../domain/entities/User.js";
import { UserModel } from "../../databases/mongo/models/UserModel.js";


export class SettingsRepository implements ISettingsRepository {
    
    async findById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId).lean();
        if (!user) return null;
        
        return user as unknown as User;
    }

    async updatePasswordHash(userId: string, newHash: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            { _id: userId },
            { $set: { password: newHash } }
        );
        return result.modifiedCount > 0;
    }

    async updatePrivacySettings(userId: string, language: string, country: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            { _id: userId },
            { 
                $set: { 
                    "settings.language": language, 
                    "settings.country": country 
                } 
            }
        );
        return result.matchedCount > 0; 
    }
}
