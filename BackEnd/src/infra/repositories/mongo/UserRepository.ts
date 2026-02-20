import { IUserRepository } from "../../../app/repositories/interfaces/shared/IUserRepository.js";
import { GetAllUsersParams } from "../../../app/usecases/admin/GetAllViewers.js";
import { UserResponseDTO } from "../../../domain/dtos/User.dto.js";
import { UserResponse } from "../../../domain/entities/User.js";
import { UserDocument, UserModel } from "../../databases/mongo/models/UserModel.js";
import { UserSchemaType } from "../../databases/mongo/types/UserDocument.js";
import { UserMapper } from "../../utils/mappers/UserMongoMapper.js";
import { BaseRepository } from "./BaseRepository.js";


export class UserRepository extends BaseRepository<UserSchemaType, UserResponse> implements IUserRepository {

    constructor() {
        super(UserModel);
    }

    protected toResponse(doc: UserDocument): UserResponse {
        return UserMapper.toResponse(doc);
    }

    async deleteById(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id).exec();
    }

    async findAllManagers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        return this.filterUsersByRole("manager", params);
    }

    async findAllPlayers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        return this.filterUsersByRole("player", params);
    }

    async findAllViewers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        return this.filterUsersByRole("viewer", params);
    }

    async findAllUmpires(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        return this.filterUsersByRole("umpire", params);
    }


    async findUnverifiedUsersForDeletion(date: Date): Promise<{ _id: string; role: string }[]> {
        return UserModel.find({
            isVerified: false,
            createdAt: { $lt: date }
        })
            .select('_id role')
            .lean<{ _id: string; role: string }[]>();
    }

    async deleteManyById(ids: string[]): Promise<number> {
        const result = await UserModel.deleteMany({ _id: { $in: ids } });
        return result.deletedCount || 0;
    }

    private async filterUsersByRole(role: string, params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }> {
        const query: Record<string, unknown> = { role };
        const andConditions: Record<string, unknown>[] = [];

        // Filter
        if (params.filter && params.filter !== "All") {
            if (params.filter === "Active") andConditions.push({ isActive: true });
            if (params.filter === "Blocked") andConditions.push({ isActive: false });
        }

        // Search
        if (params.search) {
            andConditions.push({
                $or: [
                    { name: { $regex: params.search, $options: "i" } },
                    { email: { $regex: params.search, $options: "i" } },
                ],
            });
        }

        if (andConditions.length > 0) {
            query.$and = andConditions;
        }

        const users = await UserModel.find(query)
            .skip((Number(params.page) - 1) * Number(params.limit))
            .sort({ createdAt: -1 })
            .limit(Number(params.limit))
            .lean<UserDocument[]>()
            .exec();

        const responseUsers = users.map((doc) => this.toResponse(doc));

        const totalCount = await UserModel.countDocuments({ role });

        return { users: responseUsers, totalCount };
    }
}
