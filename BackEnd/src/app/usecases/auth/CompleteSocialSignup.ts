import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { ISocialUserAuthUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase";
import { IJWTRepository } from "../../repositories/interfaces/providers/IjwtRepository";
import { IUserServices } from "../../services/user/IUserServices";
import { ILogger } from "../../providers/ILogger";
import { SocialUserRegisterData } from "../../../domain/entities/User";
import { UserMapper } from "../../mappers/UserMapper";
import { ProfileInitializationService } from "../../../infra/services/ProfileInitializationService";


@injectable()
export class CompleteSocialSignup implements ISocialUserAuthUseCase {
    constructor(
        @inject(DI_TOKENS.JWTService) private _tokenService: IJWTRepository,
        @inject(DI_TOKENS.ProfileInitializationService) private _profileInitService: ProfileInitializationService,
        @inject(DI_TOKENS.UserServices) private _userServices: IUserServices,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userData: SocialUserRegisterData) {
        this._logger.info(`Completing social signup for role: ${userData.role}`);

        const payload = await this._tokenService.verifyTempToken(userData.tempToken);

        const newUser = await this._userServices.createUser(
            userData,
            payload.email,
            payload.name,
            payload?.picture
        );

        await this._profileInitService.initialize(newUser, userData);

        const jwtPayload = { userId: newUser._id, role: newUser.role };
        const accessToken = await this._tokenService.generateAccessToken(jwtPayload);
        const refreshToken = await this._tokenService.generateRefreshToken(jwtPayload);

        await this._userServices.updateRefreshToken(newUser._id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: UserMapper.toUserLoginResponseDTO(newUser)
        };
    }
}
