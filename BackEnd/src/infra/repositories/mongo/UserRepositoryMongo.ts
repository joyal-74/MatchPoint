import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { User, UserResponse } from "domain/entities/User";
import { UserRole } from "domain/enums/Roles";
import { UserModel } from "infra/databases/mongo/models/UserModel";


export class UserRepositoryMongo implements IUserRepository {
    // Find user by MongoDB _id
    async findById(id: string): Promise<UserResponse | null> {
        return UserModel.findById(id).lean<UserResponse>().exec();
    }

    async deleteById(_id: string): Promise<void> {
        await UserModel.findByIdAndDelete(_id).exec();
    }

    async findUnverifiedUsers(date: Date) : Promise < UserResponse[]> {
        return UserModel.find({ isVerified: false, createdAt: { $lt: date } });
    }

    // Find user by email
    async findByEmail(email: string): Promise<UserResponse | null> {
        return UserModel.findOne({ email }).lean<UserResponse>().exec();
    }

    // Find users by role
    async findAllManagers(role: UserRole): Promise<ManagersResponseDTO[]> {
        return UserModel.find({ role }).lean<ManagersResponseDTO[]>().exec();
    }

    async findAllPlayers(role: UserRole): Promise<PlayersResponseDTO[]> {
        return UserModel.find({ role }).lean<PlayersResponseDTO[]>().exec();
    }

    async findAllViewers(role: UserRole): Promise<UsersResponseDTO[]> {
        return UserModel.find({ role }).lean<UsersResponseDTO[]>().exec();
    }

    // Create new user
    async create(user: User): Promise<UserResponse> {
        const created = await UserModel.create(user);
        return { ...created.toObject(), _id: created._id.toString() };
    }

    // Update user by MongoDB _id
    async update(_id: string, data: Partial<User>): Promise<UserResponse> {
        const updated = await UserModel.findByIdAndUpdate(_id, data, { new: true }).lean<UserResponse>().exec();
        if (!updated) throw new Error("User not found");
        return updated;
    }

    // Delete unverified users before a given date
    async deleteUnverifiedUsers(date: Date): Promise<number> {
        const result = await UserModel.deleteMany({ isVerified: false, createdAt: { $lt: date } });
        return result.deletedCount || 0;
    }
}