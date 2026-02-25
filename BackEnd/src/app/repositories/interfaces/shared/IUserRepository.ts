import { UserResponseDTO } from "../../../../domain/dtos/User.dto";
import { UserResponse } from "../../../../domain/entities/User";
import { UserDocument } from "../../../../infra/databases/mongo/types/UserDocument";
import { GetAllUsersParams } from "../../../usecases/admin/GetAllViewers";
import { IBaseRepository } from "../../IBaseRepository";


export interface IUserRepository extends IBaseRepository<UserDocument, UserResponse> {

    findUnverifiedUsersForDeletion(date: Date): Promise<{ _id: string; role: string }[]>

    deleteManyById(ids: string[]): Promise<number>;

    findAllManagers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllPlayers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllViewers(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    findAllUmpires(params: GetAllUsersParams): Promise<{ users: UserResponseDTO[], totalCount: number }>;

    deleteById(id: string): Promise<void>;
}
