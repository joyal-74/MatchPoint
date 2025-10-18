import { ILogoutService } from "app/providers/ILogoutService";
import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IAdminRepository } from "app/repositories/interfaces/admin/IAdminRepository";
import { Admin } from "domain/entities/Admin";
import { User } from "domain/entities/User";
import { BadRequestError } from "domain/errors";

export class LogoutService implements ILogoutService {
    constructor(
        private _userRepo: IUserRepository,
        private _adminRepo: IAdminRepository
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