import type { IUserRepository } from '../../../core/domain/repositories/interfaces/IUserRepository';
import type { User } from '../../../core/domain/entities/User';
import { userEndpoints } from '../../../infrastructure/api/endpoints/userEndpoints';
import type { Role } from '../enums/UserRole';

export class UserRepository implements IUserRepository {

    async findAll( role : Role, page: number = 1, limit: number = 10, search?: string ): Promise<{ users: User[]; total: number }> {
        return userEndpoints.getAllUsers(role, page, limit, search);
    }

    async findById(id: string, role : Role): Promise<User | null> {
        return userEndpoints.getUserById(id, role);
    }

    async findByEmail(email: string, role : Role): Promise<User | null> {
        return userEndpoints.getUserByEmail(email, role);
    }
}