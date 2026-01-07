import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { ILogger } from "app/providers/ILogger";
import { UserMapper } from "app/mappers/UserMapper";
import { ISocialUserAuthUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { JwtPayload } from "domain/entities/JwtPayload";
import { IPlayerService } from "app/services/player/IPlayerService";
import { IUserServices } from "app/services/user/IUserServices";
import { SocialUserRegisterData } from "domain/entities/User";
import { IJWTRepository } from "app/repositories/interfaces/providers/IjwtRepository";

@injectable()
export class CompleteSocialSignup implements ISocialUserAuthUseCase {
    constructor(
        @inject(DI_TOKENS.JWTService) private _tokenService: IJWTRepository,
        @inject(DI_TOKENS.UserServices) private _userServices: IUserServices,
        @inject(DI_TOKENS.PlayerService) private _playerService: IPlayerService,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
    ) { }

    async execute(userData: SocialUserRegisterData) {
        this._logger.info("Completing social signup");

        const { tempToken, role, sport } = userData;

        const payload = await this._tokenService.verifyTempToken(tempToken);
        const newUser = await this._userServices.createUser(userData, payload.email, payload.name, payload?.picture);

        if (role === "player") {
            await this._playerService.createPlayer(newUser._id, sport);
        }

        const jwtPayload: JwtPayload = { userId: newUser._id, role: newUser.role };
        const accessToken = await this._tokenService.generateAccessToken(jwtPayload);
        const refreshToken = await this._tokenService.generateRefreshToken(jwtPayload);

        await this._userServices.updateRefreshToken(newUser._id, refreshToken);

        const userDTO = UserMapper.toUserLoginResponseDTO(newUser);
        return { accessToken, refreshToken, user: userDTO };
    }
}