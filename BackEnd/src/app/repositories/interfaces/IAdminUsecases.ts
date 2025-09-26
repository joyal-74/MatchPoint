import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers"; 
import { ManagersResponseDTO } from "domain/dtos/Manager.dto";
import { PlayersResponseDTO } from "domain/dtos/Player.dto";
import { UsersResponseDTO } from "domain/dtos/User.dto";

export interface IGetUsersUsecase<TUser> {
    execute(params: GetAllUsersParams): Promise<{ users: TUser[], totalCount: number }>;
}

type RoleResponseDTO = PlayersResponseDTO | UsersResponseDTO | ManagersResponseDTO;

export interface IChangeStatusUsecase {
    execute(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>;
}

export type IGetViewersUsecase = IGetUsersUsecase<UsersResponseDTO>;
export type IGetPlayersUsecase = IGetUsersUsecase<PlayersResponseDTO>;
export type IGetManagersUsecase = IGetUsersUsecase<ManagersResponseDTO>;