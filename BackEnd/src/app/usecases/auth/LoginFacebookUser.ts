import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { ILoginFacebookUser } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IFacebookServices } from "../../services/auth/IFacebookServices.js";
import { IJWTRepository } from "../../repositories/interfaces/providers/IjwtRepository.js";
import { IUserServices } from "../../services/user/IUserServices.js";
import { IUserAuthServices } from "../../services/auth/IUserAuthServices.js";
import { ILogger } from "../../providers/ILogger.js";
import { UserMapper } from "../../mappers/UserMapper.js";
import { JwtPayload, JwtTempPayload } from "../../../domain/entities/JwtPayload.js";


@injectable()
export class LoginFacebookUser implements ILoginFacebookUser {
    constructor(
        @inject(DI_TOKENS.FacebookServices) private _facebookservices: IFacebookServices,
        @inject(DI_TOKENS.JWTService) private _tokenService: IJWTRepository,
        @inject(DI_TOKENS.UserServices) private _userServices: IUserServices,
        @inject(DI_TOKENS.UserAuthServices) private _userAuthService: IUserAuthServices,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(accessToken: string) {
        this._logger.info("Logging in user with Facebook");

        const { appId, appSecret } = this._facebookservices.validateCredentials();

        await this._facebookservices.verifyToken(accessToken, appId, appSecret);

        const { email, name, picture } = await this._facebookservices.fetchUserData(accessToken);

        const user = await this._userServices.findExistingUserByEmail(email);

        if (user) {
            if (user.authProvider === "facebook") {
                this._userAuthService.ensureUserCanLogin(user);

                const jwtPayload: JwtPayload = { userId: user._id, role: user.role };
                const accessToken = await this._tokenService.generateAccessToken(jwtPayload);
                const refreshToken = await this._tokenService.generateRefreshToken(jwtPayload);

                await this._userServices.updateRefreshToken(user._id, refreshToken);

                const userDTO = UserMapper.toUserLoginResponseDTO(user);
                return { isNewUser: false, accessToken, refreshToken, user: userDTO };
            } else {
                this._userAuthService.facebookProviderExistCheck(user);
            }
        }

        const payloadTemp: JwtTempPayload = { email, name, picture };
        const tempToken = await this._tokenService.generateTempToken(payloadTemp);

        return { isNewUser: true, tempToken, authProvider: "facebook" };
    }
}
