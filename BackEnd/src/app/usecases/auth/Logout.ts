import { inject, injectable } from "tsyringe";
import { ILogoutUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ILogoutService } from "../../services/user/ILogoutService";
import { ILogger } from "../../providers/ILogger";


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
