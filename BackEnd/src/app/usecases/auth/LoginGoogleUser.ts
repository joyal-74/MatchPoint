import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/providers/IjwtRepository";
import { JwtTempPayload } from "domain/entities/JwtPayload";
import { ILogger } from "app/providers/ILogger";
import { ILoginGoogleUser } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { UnauthorizedError } from "domain/errors";
import { IGoogleAuthServices } from "app/services/auth/IGoogleAuthService";
import { IUserAuthServices } from "app/services/auth/IUserAuthServices";

export class LoginGoogleUser implements ILoginGoogleUser {
    constructor(
        private _userRepository: IUserRepository,
        private _jwtService: IJWTRepository,
        private _googleAuthService: IGoogleAuthServices,
        private _userAuthService: IUserAuthServices,
        private _logger: ILogger,
    ) {}

    async execute(authCode: string) {
        this._logger.info("Google Login UseCase triggered");

        const idToken = await this._googleAuthService.exchangeCodeForIdToken(authCode);
        const { email, name, picture } = await this._googleAuthService.verifyIdToken(idToken);

        const user = await this._userRepository.findByEmail(email);

        if (user && user.authProvider === "google") {
            const result = await this._userAuthService.handleExistingGoogleUser(user);
            return { isNewUser: false, ...result };
        }

        if (user && user.authProvider !== "google") {
            throw new UnauthorizedError("Email already registered with password authentication");
        }

        const payloadTemp: JwtTempPayload = { email, name, picture };
        const tempToken = await this._jwtService.generateTempToken(payloadTemp);

        return { isNewUser: true, tempToken, authProvider: "google" };
    }
}