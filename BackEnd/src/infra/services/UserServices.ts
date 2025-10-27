import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IRoleIdGenerator } from "app/providers/IIdGenerator";
import { SocialUserRegisterData, UserResponse } from "domain/entities/User";
import { IUserServices } from "app/services/user/IUserServices";
import { NotFoundError } from "domain/errors";

export class UserServices implements IUserServices {
    constructor(
        private userRepository: IUserRepository,
        private idGenerator: IRoleIdGenerator
    ) { }

    async createUser(userData: SocialUserRegisterData, email: string, name: string, picture?: string) {
        const userId = this.idGenerator.generate(userData.role);
        const [firstName, lastName] = name.split(" ");
        const newUser = await this.userRepository.create({
            userId,
            email,
            firstName,
            lastName,
            profileImage: picture,
            role: userData.role,
            gender: userData.gender,
            sport: userData.sport,
            wallet: 0,
            phone: userData.phone || "NA",
            isActive: true,
            isVerified: true,
            username: userData.username || `user-${Date.now()}`,
            authProvider: userData.authProvider,
            settings: {
                theme: "dark",
                language: "en",
                currency: "INR",
                location: "",
                country: "IN",
            },
        });
        return newUser;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        await this.userRepository.update(userId, { refreshToken });
    }

    async findExistingUserByEmail(email: string): Promise<UserResponse> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError('User not found with this email')
        }
        return user
    }
}