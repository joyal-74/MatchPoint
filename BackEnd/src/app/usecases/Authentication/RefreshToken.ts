import { AdminMapper } from "app/mappers/AdminMapper";
import { UserMapper } from "app/mappers/UserMapper";
import { ILogger } from "app/providers/ILogger";
import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { IRefreshTokenUseCase, TokenUserResponse } from "app/repositories/interfaces/IAuthenticationUseCase";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { JwtPayload } from "domain/entities/JwtPayload";
import { NotFoundError, UnauthorizedError } from "domain/errors";

export class RefreshToken implements IRefreshTokenUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _adminRepository: IAdminRepository,
        private _jwtService: IJWTRepository,
        private _logger: ILogger
    ) { }

    async execute(refreshToken: string) {
        if (!refreshToken) {
            this._logger.info("Refresh token missing");
            throw new UnauthorizedError("Refresh token missing");
        }

        const payload: JwtPayload = await this._jwtService.verifyRefreshToken(refreshToken);

        this._logger.info(
            `Checking refresh token for userId: ${payload?.userId}, role: ${payload.role || "unknown"}`
        );

        const tokenPayload = { userId: payload.userId, role: payload.role };

        const [newAccessToken, newRefreshToken] = await Promise.all([
            this._jwtService.generateAccessToken(tokenPayload),
            this._jwtService.generateRefreshToken(tokenPayload),
        ]);

        let userDTO: TokenUserResponse;

        if (payload.role === "admin") {
            const admin = await this._adminRepository.findById(payload.userId);
            if (!admin) throw new NotFoundError("Admin not found");
            userDTO = AdminMapper.toAdminDTO(admin);
        } else {
            const user = await this._userRepository.findById(payload.userId);
            if (!user) throw new NotFoundError("User not found");
            userDTO = UserMapper.toUserDTO(user);
        }

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userDTO };
    }
}
