import { ILogger } from "app/providers/ILogger";
import { ILogoutUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { ILogoutService } from "app/services/user/ILogoutService";

export class LogoutUser implements ILogoutUseCase {
    constructor(
        private _logoutService: ILogoutService,
        private _logger: ILogger
    ) { }

    async execute(userId: string, role: string) {
        this._logger.info(`Logout attempt for userId: ${userId}, role: ${role}`);

        await this._logoutService.logout(userId, role);

        this._logger.info(`Logout successful for userId=${userId}, role=${role}`);

        return { success: true, message: "Logout successful", clearCookies: true };
    }
}