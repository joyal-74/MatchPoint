import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ILogger } from "app/providers/ILogger";
import { BadRequestError } from "domain/errors";

export class LogoutUser {
    constructor(
        private _userRepository: IUserRepository,
        private _adminRepository: IAdminRepository,
        private _logger: ILogger
    ) { }

    async execute(
        userId: string,
        role: string
    ): Promise<{ success: boolean; message: string, clearCookies : boolean }> {
        this._logger.info(`Logout attempt for userId: ${userId}, role: ${role}`);

        let user;
        if (role === "admin") {
            user = await this._adminRepository.findById(userId);
        } else {
            user = await this._userRepository.findById(userId);
        }

        if (!user) {
            this._logger.warn(`Logout failed. User not found: userId=${userId}, role=${role}`);
            throw new BadRequestError("User not found");
        }

        // Clear refresh token
        if (role === "admin") {
            await this._adminRepository.update(userId, { refreshToken: null });
        } else {
            await this._userRepository.update(userId, { refreshToken: null });
        }

        this._logger.info(`Logout successful for userId=${userId}, role=${role}`);

        return { success: true, message: "Logout successful", clearCookies : true };
    }
}