import { ILogger } from "app/providers/ILogger";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { JwtPayload } from "domain/entities/JwtPayload";
import { NotFoundError, UnauthorizedError } from "domain/errors";

export class RefreshTokenUser {
    constructor(
        private userRepository: IUserRepository,
        private jwtService: IJWTRepository,
        private logger: ILogger

    ) { }

    async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; user: UserResponseDTO }> {

        if (!refreshToken) {
            this.logger.info("Refresh token missing");
            throw new UnauthorizedError("Refresh token missing");
        }
        // Verify refresh token
        const payload: JwtPayload = await this.jwtService.verifyRefreshToken(refreshToken);

        this.logger.info(`Checking refresh token for userId: ${payload?.userId || "unknown"}`);

        // Find user by ID from payload
        const user = await this.userRepository.findById(payload.userId);
        if (!user) throw new NotFoundError("User not found");

        // Generate new tokens
        const newAccessToken = await this.jwtService.generateAccessToken({ userId: user._id, role: user.role });
        const newRefreshToken = await this.jwtService.generateRefreshToken({ userId: user._id, role: user.role });

        // Map user to DTO
        const userDTO: UserResponseDTO = {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            role: user.role,
            gender: user.gender,
            phone: user.phone,
            wallet: user.wallet,
        };

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userDTO };
    }
}
