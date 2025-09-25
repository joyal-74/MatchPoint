import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { UsersResponseDTO } from "domain/dtos/User.dto";
import { User, UserRegister, UserResponse } from "domain/entities/User";


export interface IUserRepository {
    findById(_id: string): Promise<UserResponse | null>;

    deleteById(_id: string): Promise<void>;

    findByEmail(email: string): Promise<UserResponse | null>;

    findAllPlayers(params: GetAllUsersParams): Promise<{users : PlayersResponseDTO[], totalCount : number}>;

    findAllViewers(params : GetAllUsersParams): Promise<{users : UsersResponseDTO[], totalCount : number}>;

    findAllManagers(params: GetAllUsersParams): Promise<{users : ManagersResponseDTO[], totalCount : number}>;

    create(user: UserRegister): Promise<UserRegister & { _id: string }>;

    update(_id: string, data: Partial<User>): Promise<UserResponse>;

    findUnverifiedUsers(date: Date): Promise<UserResponse[]>;
}
