import type { User } from "../../entities/User";
import { Role } from '../../enums/UserRole'

export interface IUserRepository {
    findAll(role : Role, page?: number, limit?: number, search?: string): Promise<{ users: User[]; total: number }>;
    findById(id: string, role : Role): Promise<User | null>;
    findByEmail(email: string, Role : string): Promise<User | null>;
}
