import { ManagerResponseDTO, ManagerUpdateDTO } from "domain/dtos/Manager.dto";
import { PlayerResponseDTO, PlayerUpdateDTO } from "domain/dtos/Player.dto";
import { UserResponseDTO, UserUpdateDTO } from "domain/dtos/User.dto";
import { File } from "domain/entities/File";


export interface IGetManagerProfile {
    execute(managerId: string): Promise<ManagerResponseDTO>;
}

export interface IUpdateManagerProfile {
    execute(updateData: ManagerUpdateDTO, file?: File): Promise<ManagerResponseDTO>;
}

export interface IGetPlayerProfile {
    execute(managerId: string): Promise<PlayerResponseDTO>;
}

export interface IUpdatePlayerProfile {
    execute(updateData: PlayerUpdateDTO, file?: File): Promise<PlayerResponseDTO>;
}

export interface IGetViewerProfile {
    execute(userId: string): Promise<UserResponseDTO>;
}

export interface IUpdateViewerProfile {
    execute(updateData: UserUpdateDTO, file?: File): Promise<UserResponseDTO>;
}