import { inject, injectable } from "tsyringe";
import { IAdminAuthUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IAdminRepository } from "../../repositories/interfaces/admin/IAdminRepository.js";
import { IJWTRepository } from "../../repositories/interfaces/providers/IjwtRepository.js";
import { IPasswordHasher } from "../../providers/IPasswordHasher.js";
import { ILogger } from "../../providers/ILogger.js";
import { NotFoundError, UnauthorizedError } from "../../../domain/errors/index.js";
import { AdminToResponseDTO } from "../../../domain/dtos/Admin.dto.js";
import { AdminMapper } from "../../mappers/AdminMapper.js";
import { JwtPayload } from "../../../domain/entities/JwtPayload.js";


@injectable()
export class LoginAdmin implements IAdminAuthUseCase {
    constructor(
        @inject(DI_TOKENS.AdminRepository) private _adminRepository: IAdminRepository,
        @inject(DI_TOKENS.JWTService) private _jwtService: IJWTRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.Logger) private _logger: ILogger,
    ) { }

    async execute(email: string, password: string) {
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

        const adminDTO: AdminToResponseDTO = AdminMapper.toAdminDTO(admin);

        return { accessToken, refreshToken, account: adminDTO };
    }
}
