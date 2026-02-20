import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ProfileInitializationService } from "../../../infra/services/ProfileInitializationService.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IPasswordHasher } from "../../providers/IPasswordHasher.js";
import { IRoleIdGenerator } from "../../providers/IIdGenerator.js";

interface BulkResult {
    email: string;
    status: "success" | "failed";
    error?: string;
}

@injectable()
export class BulkUserSignup {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.PasswordHasher) private _hasher: IPasswordHasher,
        @inject(DI_TOKENS.UserIdGenerator) private _idGen: IRoleIdGenerator,
        @inject(DI_TOKENS.ProfileInitializationService) private _profileInit: ProfileInitializationService,
    ) { }

    async execute(users: any[]) {
        const results: BulkResult[] = [];

        for (const userData of users) {
            try {
                const hashedPassword = await this._hasher.hashPassword(userData.password || "Welcome@123");
                const customId = this._idGen.generate(userData.role);

                const newUser = await this._userRepo.create({
                    userId: customId,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    password: hashedPassword,
                    phone: userData.phone,
                    gender: userData.gender,
                    role: userData.role,
                    username: userData.username || `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    sport: userData.sport || "Cricket",
                    wallet: 0,
                    isActive: true,
                    isVerified: true,
                    subscription: "Free",
                    settings: {
                        theme: userData.settings?.theme || "dark",
                        language: userData.settings?.language || "en",
                        currency: userData.settings?.currency || "INR",
                        location: userData.settings?.location || "",
                        country: userData.settings?.country || "IN",
                    }
                });

                await this._profileInit.initialize(newUser, userData);

                results.push({ email: userData.email, status: "success" });
            } catch (error: any) {
                results.push({ 
                    email: userData.email, 
                    status: "failed", 
                    error: error instanceof Error ? error.message : String(error) 
                });
            }
        }

        return results;
    }
}