import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { UserResponseDTO } from "domain/dtos/User.dto";
import { User, UserRegister, UserResponse } from "domain/entities/User";


export interface IUserRepository {
    findById(_id: string): Promise<UserResponse | null>;

    deleteById(_id: string): Promise<void>;

    findByEmail(email: string): Promise<UserResponse | null>;

    findAllPlayers(params: GetAllUsersParams): Promise<{users : UserResponseDTO[], totalCount : number}>;

    findAllViewers(params : GetAllUsersParams): Promise<{users : UserResponseDTO[], totalCount : number}>;

    findAllManagers(params: GetAllUsersParams): Promise<{users : UserResponseDTO[], totalCount : number}>;

    create(user: UserRegister): Promise<UserResponse>;

    update(_id: string, data: Partial<User>): Promise<UserResponse>;

    findUnverifiedUsers(date: Date): Promise<UserResponse[]>;
}
