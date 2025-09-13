import type { IUserRepository } from '../../../../core/domain/repositories/interfaces/IUserRepository';
import { UserModel } from '../../database/mongo/models/UserModel'
import type { User } from '../../../../core/domain/entities/User';
import { UserRole } from '../../../../core/domain/types/UserRoles';

export class UserRepositoryMongo implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        return UserModel.findById(id).lean();
    }

    async findByEmail(email: string): Promise<User | null> {
        return UserModel.findById({ email }).lean();
    }

    async findByRole(role: UserRole): Promise<User[]> {
        return UserModel.find({ role }).lean();
    }

    async create(user: User): Promise<User> {
        const created = await UserModel.create(user);
        return created.toObject();
    }

    async update(userId: string, data: Partial<User>): Promise<User | null> {
        const updated = await UserModel.findOneAndUpdate({ userId }, data, { new: true }).lean();
        return updated;
    }
}