import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IRefreshTokenUseCase, TokenUserResponse } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IAdminRepository } from "../../repositories/interfaces/admin/IAdminRepository.js";
import { IJWTRepository } from "../../repositories/interfaces/providers/IjwtRepository.js";
import { ILogger } from "../../providers/ILogger.js";
import { NotFoundError, UnauthorizedError } from "../../../domain/errors/index.js";
import { JwtPayload } from "jsonwebtoken";
import { AdminMapper } from "../../mappers/AdminMapper.js";
import { UserMapper } from "../../mappers/UserMapper.js";


@injectable()
export class RefreshToken implements IRefreshTokenUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.AdminRepository) private _adminRepository: IAdminRepository,
        @inject(DI_TOKENS.JWTService) private _jwtService: IJWTRepository,
        @inject(DI_TOKENS.Logger) private _logger: ILogger
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
            userDTO = UserMapper.toUserLoginResponseDTO(user);
        }

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userDTO };
    }
}
