import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { UserRegisterResponseDTO, UsersResponseDTO } from "domain/dtos/User.dto";
import { User, UserRegister, UserResponse } from "domain/entities/User";


export interface IUserRepository {
    findById(_id: string): Promise<UserResponse | null>;

    deleteById(_id: string): Promise<void>;

    findByEmail(email: string): Promise<UserResponse | null>;

    findAllPlayers(params: GetAllUsersParams): Promise<PlayersResponseDTO[]>;

    findAllViewers(params : GetAllUsersParams): Promise<UsersResponseDTO[]>;

    findAllManagers(params: GetAllUsersParams): Promise<ManagersResponseDTO[]>;

    create(user: UserRegister): Promise<UserRegisterResponseDTO>;

    update(_id: string, data: Partial<User>): Promise<UserResponse>;

    findUnverifiedUsers(date: Date): Promise<UserResponse[]>;
}
