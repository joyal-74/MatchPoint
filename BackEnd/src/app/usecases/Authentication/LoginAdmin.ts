import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import bcrypt from "bcryptjs";
import { AdminToResponseDTO } from "domain/dtos/Admin.dto";
import { JwtPayload } from "domain/entities/JwtPayload";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { LoginDTOAdmin } from "domain/dtos/Login.dto";
import { NotFoundError, UnauthorizedError } from "domain/errors";
import { IPasswordHasher } from "app/providers/IPasswordHasher";

export class LoginAdmin {
    constructor(
        private userRepository: IAdminRepository,
        private jwtService: IJWTRepository,
        private passwordHasher: IPasswordHasher,
    ) { }

    async execute(email: string, password: string): Promise<LoginDTOAdmin> {
        const admin = await this.userRepository.findByEmail(email);
        if (!admin) throw new NotFoundError("Admin not found");

        const match = await this.passwordHasher.comparePasswords(password, admin.password);
        if (!match) throw new UnauthorizedError("Invalid credentials");

        const payload: JwtPayload = { userId: admin._id, role: admin.role };

        const accessToken = await this.jwtService.generateAccessToken(payload);
        const refreshToken = await this.jwtService.generateRefreshToken(payload);

        await this.userRepository.update(admin._id, { refreshToken });

        const adminDTO: AdminToResponseDTO = {
            _id: admin._id,
            email: admin.email,
            first_name: admin.first_name,
            last_name: admin.last_name,
            role: admin.role,
            wallet: admin.wallet,
        };

        return { accessToken, refreshToken, admin: adminDTO };
    }
}