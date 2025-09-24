import { ILogger } from "app/providers/ILogger";
import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { AdminToResponseDTO } from "domain/dtos/Admin.dto";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { AdminResponse } from "domain/entities/Admin";
import { JwtPayload } from "domain/entities/JwtPayload";
import { UserResponse } from "domain/entities/User";
import { NotFoundError, UnauthorizedError } from "domain/errors";


type TokenUserResponse = UserResponseDTO | AdminToResponseDTO;

export class RefreshTokenUser {
    constructor(
        private _userRepository: IUserRepository,
        private _adminRepository: IAdminRepository,
        private _jwtService: IJWTRepository,
        private _logger: ILogger
    ) { }

    async execute(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: TokenUserResponse;
    }> {
        if (!refreshToken) {
            this._logger.info("Refresh token missing");
            throw new UnauthorizedError("Refresh token missing");
        }

        const payload : JwtPayload = await this._jwtService.verifyRefreshToken(refreshToken);

        this._logger.info(
            `Checking refresh token for userId: ${payload?.userId}, role: ${payload.role || "unknown"}`
        );

        let user: UserResponse | AdminResponse | null;

        if (payload.role === "admin") {
            user = await this._adminRepository.findById(payload.userId);
        } else {
            user = await this._userRepository.findById(payload.userId);
        }

        if (!user) throw new NotFoundError("User not found");

        const newAccessToken = await this._jwtService.generateAccessToken({
            userId: user._id,
            role: user.role,
        });
        const newRefreshToken = await this._jwtService.generateRefreshToken({
            userId: user._id,
            role: user.role,
        });


        let userDTO: TokenUserResponse;
        if (payload.role === "admin") {
            userDTO = {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: "admin",
                wallet: user.wallet,
            };
        } else {
            const u = user as UserResponse;
            userDTO = {
                _id: u._id,
                userId: u.userId,
                email: u.email,
                first_name: u.first_name,
                last_name: u.last_name,
                username: u.username,
                role: u.role,
                gender: u.gender,
                phone: u.phone,
                wallet: u.wallet,
                logo: u.logo,
                sport: u.sport,
            };
        }

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userDTO };
    }
}