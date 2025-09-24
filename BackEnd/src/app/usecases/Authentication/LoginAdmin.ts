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
        private _adminRepository: IAdminRepository,
        private _jwtService: IJWTRepository,
        private _passwordHasher: IPasswordHasher,
        private _logger: ILogger,
    ) { }

    async execute(email: string, password: string): Promise<LoginDTOAdmin> {
        this._logger.info("Admin login attempt", { email });

        const admin = await this._adminRepository.findByEmail(email);
        if (!admin) throw new NotFoundError("Admin not found");

        const match = await this._passwordHasher.comparePasswords(password, admin.password);
        if (!match) {
            this._logger.warn("Invalid credentials for admin", { email });
            throw new UnauthorizedError("Invalid credentials");
        }

        this._logger.info("Admin login successful", { email, adminId: admin._id });

        const payload: JwtPayload = { userId: admin._id, role: admin.role };

        const accessToken = await this._jwtService.generateAccessToken(payload);
        const refreshToken = await this._jwtService.generateRefreshToken(payload);

        const updatedAdmin = await this._adminRepository.update(admin._id, { refreshToken });
        if (!updatedAdmin) throw new NotFoundError("Admin not found");

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