import { UserDocument } from "infra/databases/mongo/models/UserModel";
import { UserResponse } from "domain/entities/User";
import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { IBaseRepository } from "app/repositories/IBaseRepository";

export interface IUserRepository extends IBaseRepository<UserDocument, UserResponse> {

    findUnverifiedUsers(date: Date): Promise<UserResponse[]>;

    findAllManagers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllPlayers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllViewers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    deleteById(id: string): Promise<void>;

    deleteUnverifiedUsers(date: Date): Promise<number>;
}
