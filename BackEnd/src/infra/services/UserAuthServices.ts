import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers";

import { UserMapper } from "../../app/mappers/UserMapper";
import { IJWTRepository } from "../../app/repositories/interfaces/providers/IjwtRepository";
import { IUserRepository } from "../../app/repositories/interfaces/shared/IUserRepository";
import { IUserAuthServices } from "../../app/services/auth/IUserAuthServices";
import { UserLoginResponseDTO } from "../../domain/dtos/User.dto";
import { JwtPayload } from "../../domain/entities/JwtPayload";
import { UserResponse } from "../../domain/entities/User";
import { UnauthorizedError } from "../../domain/errors/index";


@injectable()
export class UserAuthServices implements IUserAuthServices {

    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.JWTService) private _jwtService: IJWTRepository
    ) { }

    ensureUserCanLogin(user: UserResponse) {
        if (!user.isActive) {
            throw new UnauthorizedError("User is blocked, please contact admin");
        }
    }

    facebookProviderExistCheck(user: UserResponse) {
        if (user && user.authProvider !== "facebook") {
            throw new UnauthorizedError("Email already registered with password authentication");
        }
    }

    googleProviderExistCheck(user: UserResponse) {
        if (user && user.authProvider !== "google") {
            throw new UnauthorizedError("Email already registered with password authentication");
        }
    }

    async handleExistingGoogleUser(user: UserResponse): Promise<{ accessToken: string; refreshToken: string; user: UserLoginResponseDTO; }> {

        if (!user.isActive) {
            throw new UnauthorizedError("User is blocked, please contact admin");
        }

        const jwtPayload: JwtPayload = { userId: user._id, role: user.role };
        const accessToken = await this._jwtService.generateAccessToken(jwtPayload);
        const refreshToken = await this._jwtService.generateRefreshToken(jwtPayload);

        await this._userRepository.update(user._id, { refreshToken });
        const userDTO = UserMapper.toUserLoginResponseDTO(user);

        return { accessToken, refreshToken, user: userDTO };
    }
}
