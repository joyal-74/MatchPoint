import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { User, UserRegister, UserResponse } from "domain/entities/User";
import { NotFoundError } from "domain/errors";
import { UserModel } from "infra/databases/mongo/models/UserModel";


export class UserRepositoryMongo implements IUserRepository {
    // Find user by MongoDB _id
    async findById(id: string): Promise<UserResponse | null> {
        return UserModel.findById(id).lean<UserResponse>().exec();
    }

    async deleteById(_id: string): Promise<void> {
        await UserModel.findByIdAndDelete(_id).exec();
    }

    async findUnverifiedUsers(date: Date): Promise<UserResponse[]> {
        return UserModel.find({ isVerified: false, createdAt: { $lt: date } });
    }

    // Find user by email
    async findByEmail(email: string): Promise<UserResponse | null> {
        return UserModel.findOne({ email }).lean<UserResponse>().exec();
    }

    // Find users by role
    async findAllManagers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        const query: Record<string, unknown> = { role: "manager" };
        const andConditions: Record<string, unknown>[] = [];

        // Filter logic
        if (params.filter && params.filter !== "All") {
            if (params.filter === "Active") andConditions.push({ isActive: true });
            if (params.filter === "Blocked") andConditions.push({ isActive: false });
        }

        // Search logic
        if (params.search) {
            andConditions.push({
                $or: [
                    { name: { $regex: params.search, $options: "i" } },
                    { email: { $regex: params.search, $options: "i" } },
                ],
            });
        }

        // Combine conditions if any exist
        if (andConditions.length > 0) {
            query.$and = andConditions;
        }


        const users = await UserModel.find(query)
            .skip((Number(params.page) - 1) * Number(params.limit))
            .sort({ createdAt: -1 })
            .limit(Number(params.limit))
            .lean<UserResponseDTO[]>()
            .exec();

        const totalCount = await UserModel.countDocuments({ role: 'manager' })

        return { users, totalCount };
    }

    async findAllPlayers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        const query: Record<string, unknown> = { role: "player" };
        const andConditions: Record<string, unknown>[] = [];

        // Filter logic
        if (params.filter && params.filter !== "All") {
            if (params.filter === "Active") andConditions.push({ isActive: true });
            if (params.filter === "Blocked") andConditions.push({ isActive: false });
        }

        // Search logic
        if (params.search) {
            andConditions.push({
                $or: [
                    { name: { $regex: params.search, $options: "i" } },
                    { email: { $regex: params.search, $options: "i" } },
                ],
            });
        }

        // Combine conditions if any exist
        if (andConditions.length > 0) {
            query.$and = andConditions;
        }

        const users = await UserModel.find(query)
            .skip((Number(params.page) - 1) * Number(params.limit))
            .sort({ createdAt: -1 })
            .limit(Number(params.limit))
            .lean<UserResponseDTO[]>()
            .exec();

        const totalCount = await UserModel.countDocuments({ role: 'player' })

        return { users, totalCount };
    }

    async findAllViewers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        const query: Record<string, unknown> = { role: "viewer" };
        const andConditions: Record<string, unknown>[] = [];

        // Filter logic
        if (params.filter && params.filter !== "All") {
            if (params.filter === "Active") andConditions.push({ isActive: true });
            if (params.filter === "Blocked") andConditions.push({ isActive: false });
        }

        // Search logic
        if (params.search) {
            andConditions.push({
                $or: [
                    { firstName: { $regex: params.search, $options: "i" } },
                    { email: { $regex: params.search, $options: "i" } },
                ],
            });
        }

        // Combine conditions if any exist
        if (andConditions.length > 0) {
            query.$and = andConditions;
        }


        const users = await UserModel.find(query)
            .skip((Number(params.page) - 1) * Number(params.limit))
            .sort({ createdAt: -1 })
            .limit(Number(params.limit))
            .lean<UserResponseDTO[]>()
            .exec();

        const totalCount = await UserModel.countDocuments({ role: 'viewer' })

        return { users, totalCount };
    }

    // Create new user
    async create(user: UserRegister): Promise<UserResponse> {
        const created = await UserModel.create(user);
        return { ...created.toObject(), _id: created._id.toString() };
    }

    // Update user by MongoDB _id
    async update(_id: string, data: Partial<User>): Promise<UserResponse> {
        const updated = await UserModel.findByIdAndUpdate(_id, data, { new: true }).lean<UserResponse>().exec();
        if (!updated) throw new NotFoundError("User not found");
        return updated;
    }

    // Delete unverified users before a given date
    async deleteUnverifiedUsers(date: Date): Promise<number> {
        const result = await UserModel.deleteMany({ isVerified: false, createdAt: { $lt: date } });
        return result.deletedCount || 0;
    }
}