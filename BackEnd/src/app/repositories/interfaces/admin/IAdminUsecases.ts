import { GetAllUsersParams } from "app/usecases/admin/GetAllViewers";
import { ManagerDetails } from "app/usecases/admin/GetManagerDetails";
import { PlayerDetails } from "app/usecases/admin/GetPlayerDetails";
import { ViewerDetails } from "app/usecases/admin/GetViewerDetails";
import { ManagerResponseDTO } from "domain/dtos/Manager.dto";
import { PlayerResponseDTO } from "domain/dtos/Player.dto";
import { UserResponseDTO } from "domain/dtos/User.dto";

export interface IGetUsersUsecase<TUser> {
    execute(params: GetAllUsersParams): Promise<{ users: TUser[], totalCount: number }>;
}

export type RoleResponseDTO = PlayerResponseDTO | UserResponseDTO | ManagerResponseDTO;

export interface IChangeUserStatus {
    execute(role: string, userId: string, isActive: boolean, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>;
}

export interface IChangeUserBlockStatus {
    execute(userId: string, isActive: boolean): Promise<RoleResponseDTO>;
}

export interface IGetUsersByRole {
    execute(role: string, params: GetAllUsersParams): Promise<{ users: RoleResponseDTO[], totalCount: number }>
}

export type IGetViewersUsecase = IGetUsersUsecase<UserResponseDTO>;
export type IGetPlayersUsecase = IGetUsersUsecase<PlayerResponseDTO>;
export type IGetManagersUsecase = IGetUsersUsecase<ManagerResponseDTO>;

export interface IGetManagerDetails {
    execute(id: string): Promise<ManagerDetails>;
}

export interface IGetPlayerDetails {
    execute(id: string): Promise<PlayerDetails>;
}

export interface IGetViewerDetails {
    execute(id: string): Promise<ViewerDetails>;
}