import type { IUserRepository } from '../../../../core/domain/repositories/interfaces/IUserRepository';
import { UserModel } from '../../database/mongo/models/UserModel'
import type { User } from '../../../../core/domain/entities/User';
import { UserRole } from '../../../../core/domain/types/UserRoles';
import { PersistedUser } from '@shared/types/Types';

export class UserRepositoryMongo implements IUserRepository {
    async findById(id: string): Promise<PersistedUser | null> {
        return UserModel.findById(id).lean();
    }

    async findByEmail(email: string): Promise<PersistedUser | null> {
        return UserModel.findOne({ email }).lean<PersistedUser>().exec();
    }


    async findByRole(role: UserRole): Promise<PersistedUser[]> {
        return UserModel.find({ role }).lean();
    }

    async create(user: User): Promise<User> {
        const created = await UserModel.create(user);
        return created.toObject();
    }

    async update(userId: string, data: Partial<PersistedUser>): Promise<PersistedUser> {
        const updated = await UserModel.findOneAndUpdate({ userId }, data, { new: true }).lean<PersistedUser>();
        if (!updated) throw new Error("User not found");
        return updated;
    }

}