import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { UserRegisterResponseDTO, UsersResponseDTO } from "domain/dtos/User.dto";
import { User, UserRegister, UserResponse } from "domain/entities/User";
import { UserRole } from "domain/enums/Roles";

export interface IUserRepository {
    findById(_id: string): Promise<UserResponse | null>;

    deleteById(_id: string): Promise<void>;

    findByEmail(email: string): Promise<UserResponse | null>;

    findAllPlayers(role: UserRole): Promise<PlayersResponseDTO[]>;

    findAllViewers(role: UserRole): Promise<UsersResponseDTO[]>;

    findAllManagers(role: UserRole): Promise<ManagersResponseDTO[]>;

    create(user: UserRegister): Promise<UserRegisterResponseDTO>;

    update(_id: string, data: Partial<User>): Promise<UserResponse>;

    findUnverifiedUsers(date: Date): Promise<UserResponse[]>;
}
