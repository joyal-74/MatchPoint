import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../domain/constants/Identifiers.js";
import { ILogoutService } from "../../app/services/user/ILogoutService.js";
import { IUserRepository } from "../../app/repositories/interfaces/shared/IUserRepository.js";
import { IAdminRepository } from "../../app/repositories/interfaces/admin/IAdminRepository.js";
import { BadRequestError } from "../../domain/errors/index.js";
import { Admin } from "../../domain/entities/Admin.js";
import { User } from "../../domain/entities/User.js";


@injectable()
export class LogoutService implements ILogoutService {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.AdminRepository) private _adminRepo: IAdminRepository
    ) { }

    async logout(userId: string, role: string): Promise<void> {
        let user : User | Admin | null;

        if (role === "admin") {
            user = await this._adminRepo.findById(userId);
            if (!user) throw new BadRequestError("Admin not found");
            await this._adminRepo.update(userId, { refreshToken: null });
        } else {
            user = await this._userRepo.findById(userId);
            if (!user) throw new BadRequestError("User not found");
            await this._userRepo.update(userId, { refreshToken: null });
        }
    }
}
