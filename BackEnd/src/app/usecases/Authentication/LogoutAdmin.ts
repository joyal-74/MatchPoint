import { IAdminRepository } from "app/repositories/interfaces/IAdminRepository";
import { BadRequestError } from "domain/errors";

export class LogoutAdmin {
    constructor(
        private adminRepository: IAdminRepository,
    ) { }

    async execute(userId: string): Promise<{ success: boolean; message: string }> {

        const admin = await this.adminRepository.findById(userId);
        if (!admin) throw new BadRequestError("Admin not found");

        await this.adminRepository.update(userId, { refreshToken: null });

        return { success: true, message: "Logout successful" };
    }
}
