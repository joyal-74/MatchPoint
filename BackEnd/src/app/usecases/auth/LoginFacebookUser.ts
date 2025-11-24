import { ILogger } from "app/providers/ILogger";
import { ILoginFacebookUser } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { UserMapper } from "app/mappers/UserMapper";
import { JwtPayload, JwtTempPayload } from "domain/entities/JwtPayload";
import { IFacebookServices } from "app/services/auth/IFacebookServices";
import { IJWTRepository } from "app/repositories/interfaces/providers/IjwtRepository";
import { IUserAuthServices } from "app/services/auth/IUserAuthServices";
import { IUserServices } from "app/services/user/IUserServices";


export class LoginFacebookUser implements ILoginFacebookUser {
    constructor(
        private _facebookservices: IFacebookServices,
        private _tokenService: IJWTRepository,
        private _userServices: IUserServices,
        private _userAuthService: IUserAuthServices,
        private _logger: ILogger
    ) { }

    async execute(accessToken: string) {
        this._logger.info("Logging in user with Facebook");

        const { appId, appSecret } = this._facebookservices.validateCredentials();

        await this._facebookservices.verifyToken(accessToken, appId, appSecret);

        const { email, name, picture } = await this._facebookservices.fetchUserData(accessToken);

        const user = await this._userServices.findExistingUserByEmail(email);

        if (user && user.authProvider === "facebook") {
            this._userAuthService.ensureUserCanLogin(user);

            const jwtPayload: JwtPayload = { userId: user._id, role: user.role };
            const accessToken = await this._tokenService.generateAccessToken(jwtPayload);
            const refreshToken = await this._tokenService.generateRefreshToken(jwtPayload);

            await this._userServices.updateRefreshToken(user._id, refreshToken);

            const userDTO = UserMapper.toUserLoginResponseDTO(user);
            return { isNewUser: false, accessToken, refreshToken, user: userDTO };
        }

        this._userAuthService.facebookProviderExistCheck(user);

        const payloadTemp: JwtTempPayload = { email, name, picture };
        const tempToken = await this._tokenService.generateTempToken(payloadTemp);

        return { isNewUser: true, tempToken, authProvider: "facebook" };
    }
}