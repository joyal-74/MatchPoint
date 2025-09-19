import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { AdminToResponseDTO } from "domain/dtos/Admin.dto";
import { JwtPayload } from "domain/entities/JwtPayload";
import { NotFoundError, UnauthorizedError } from "domain/errors";

export class RefreshTokenAdmin {
    constructor(
        private AdminRepository: IAdminRepository,
        private jwtService: IJWTRepository
    ) { }

    async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; admin: AdminToResponseDTO }> {
        // Verify refresh token
        let payload: JwtPayload;
        try {
            payload = await this.jwtService.verifyRefreshToken(refreshToken);
        } catch {
            throw new UnauthorizedError("Invalid refresh token");
        }

        // Find Admin by ID from payload
        const admin = await this.AdminRepository.findById(payload.userId);
        if (!admin) throw new NotFoundError("Admin not found");

        // Generate new tokens
        const newAccessToken = await this.jwtService.generateAccessToken({ userId: admin._id, role: admin.role });
        const newRefreshToken = await this.jwtService.generateRefreshToken({ userId: admin._id, role: admin.role });

        // Map Admin to DTO
        const AdminDTO: AdminToResponseDTO = {
            _id: admin._id,
            email: admin.email,
            first_name: admin.first_name,
            last_name: admin.last_name,
            role: admin.role,
            wallet: admin.wallet,
        };

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, admin: AdminDTO };
    }
}
