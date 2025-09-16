import { AdminRepository } from '@infra/persistence/repositories/mongo/AdminRepositoryMongo'; 
import { AuthService } from './AuthService';
import { toAdminResponseDTO } from '@infra/http/Express/dtos/Admin.dto';
import bcrypt from 'bcryptjs';
import { UserRole } from '@core/domain/types/UserRoles';

export class AdminService {
    constructor(
        private adminRepo: AdminRepository,
        private authService: AuthService
    ) {}

    async login(email: string, password: string) {
        const admin = await this.adminRepo.findByEmail(email);
        if (!admin) throw new Error("Admin not found");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const tokens = await this.authService.generateTokens({
            _id: admin._id.toString(),
            email: admin.email,
            role: UserRole.ADMIN
        });

        return { admin: toAdminResponseDTO(admin), tokens };
    }
}
