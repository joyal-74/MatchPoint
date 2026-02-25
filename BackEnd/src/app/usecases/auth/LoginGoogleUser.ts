import { inject, injectable } from "tsyringe";
import { ILoginGoogleUser } from "../../repositories/interfaces/auth/IAuthenticationUseCase";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { IJWTRepository } from "../../repositories/interfaces/providers/IjwtRepository";
import { IGoogleAuthServices } from "../../services/auth/IGoogleAuthService";
import { IUserAuthServices } from "../../services/auth/IUserAuthServices";
import { ILogger } from "../../providers/ILogger";
import { UnauthorizedError } from "../../../domain/errors/index";
import { JwtTempPayload } from "../../../domain/entities/JwtPayload";


@injectable()
export class LoginGoogleUser implements ILoginGoogleUser {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.JWTService) private _jwtService: IJWTRepository,
        @inject(DI_TOKENS.GoogleAuthService) private _googleAuthService: IGoogleAuthServices,
        @inject(DI_TOKENS.UserAuthServices) private _userAuthService: IUserAuthServices,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
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

        return { 
            isNewUser: true, 
            tempToken, 
            authProvider: "google",
            user: {
                email,
                firstName: name?.split(" ")[0] || "",
                lastName: name?.split(" ").slice(1).join(" ") || "",
                profileImage: picture || null
            }
        };
    }
}
