import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { ILogoutUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { ILogoutService } from "app/services/user/ILogoutService";

@injectable()
export class LogoutUser implements ILogoutUseCase {
    constructor(
        @inject(DI_TOKENS.LogoutService) private _logoutService: ILogoutService,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userId: string, role: string) {
        this._logger.info(`Logout attempt for userId: ${userId}, role: ${role}`);

        await this._logoutService.logout(userId, role);

        this._logger.info(`Logout successful for userId=${userId}, role=${role}`);

        return { success: true, message: "Logout successful", clearCookies: true };
    }
}