import { UserResponseDTO } from "../../../../domain/dtos/User.dto.js";
import { UserResponse } from "../../../../domain/entities/User.js";
import { UserDocument } from "../../../../infra/databases/mongo/types/UserDocument.js";
import { GetAllUsersParams } from "../../../usecases/admin/GetAllViewers.js";
import { IBaseRepository } from "../../IBaseRepository.js";


export interface IUserRepository extends IBaseRepository<UserDocument, UserResponse> {

    findUnverifiedUsersForDeletion(date: Date): Promise<{ _id: string; role: string }[]>

    deleteManyById(ids: string[]): Promise<number>;

    findAllManagers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllPlayers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllViewers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllUmpires(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    deleteById(id: string): Promise<void>;
}
