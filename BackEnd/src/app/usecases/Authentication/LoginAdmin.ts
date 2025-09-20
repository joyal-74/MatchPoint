import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { AdminToResponseDTO } from "domain/dtos/Admin.dto";
import { JwtPayload } from "domain/entities/JwtPayload";
import { IJWTRepository } from "app/repositories/interfaces/IjwtRepository";
import { LoginDTOAdmin } from "domain/dtos/Login.dto";
import { NotFoundError, UnauthorizedError } from "domain/errors";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { ILogger } from "app/providers/ILogger";

export class LoginAdmin {
    constructor(
        private userRepository: IAdminRepository,
        private jwtService: IJWTRepository,
        private passwordHasher: IPasswordHasher,
        private logger: ILogger,
    ) { }

    async execute(email: string, password: string): Promise<LoginDTOAdmin> {
        this.logger.info("Admin login attempt", { email });

        const admin = await this.userRepository.findByEmail(email);
        if (!admin) throw new NotFoundError("Admin not found");

        const match = await this.passwordHasher.comparePasswords(password, admin.password);
        if (!match) {
            this.logger.warn("Invalid credentials for admin", { email });
            throw new UnauthorizedError("Invalid credentials");
        }

        this.logger.info("Admin login successful", { email, adminId: admin._id });

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