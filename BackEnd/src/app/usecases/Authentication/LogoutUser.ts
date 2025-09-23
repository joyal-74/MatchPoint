import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { BadRequestError } from "domain/errors";

export class LogoutUser {
    constructor(
        private userRepository: IUserRepository,
        private adminRepository: IAdminRepository,
        private logger: ILogger
    ) { }

    async execute(
        userId: string,
        role: string
    ): Promise<{ success: boolean; message: string }> {
        this.logger.info(`Logout attempt for userId: ${userId}, role: ${role}`);

        let user;
        if (role === "admin") {
            user = await this.adminRepository.findById(userId);
        } else {
            user = await this.userRepository.findById(userId);
        }

        if (!user) {
            this.logger.warn(`Logout failed. User not found: userId=${userId}, role=${role}`);
            throw new BadRequestError("User not found");
        }

        // Clear refresh token
        if (role === "admin") {
            await this.adminRepository.update(userId, { refreshToken: null });
        } else {
            await this.userRepository.update(userId, { refreshToken: null });
        }

        this.logger.info(`Logout successful for userId=${userId}, role=${role}`);

        return { success: true, message: "Logout successful" };
    }
}
