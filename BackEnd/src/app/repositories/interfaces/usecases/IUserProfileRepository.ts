import { ManagerResponseDTO, ManagerUpdateDTO } from "../../../../domain/dtos/Manager.dto.js";
import { PlayerProfileFieldDTO, PlayerProfileResponse, PlayerUpdateDTO } from "../../../../domain/dtos/Player.dto.js";
import { UmpireResponseDTO, UmpireUpdateDTO } from "../../../../domain/dtos/Umpire.dto.js";
import { UserResponseDTO, UserUpdateDTO } from "../../../../domain/dtos/User.dto.js";
import { File } from "../../../../domain/entities/File.js";
import { PopulatedPlayer } from "../../../../domain/entities/Player.js";


export interface IGetManagerProfile {
    execute(managerId: string): Promise<ManagerResponseDTO>;
}

export interface IGetUmpireProfile {
    execute(umpireId: string): Promise<UmpireResponseDTO>;
}

export interface IUpdateManagerProfile {
    execute(updateData: ManagerUpdateDTO, file?: File): Promise<ManagerResponseDTO>;
}

export interface IUpdateUmpireProfile {
    execute(updateData: UmpireUpdateDTO, file?: File): Promise<UmpireResponseDTO>;
}

export interface IGetPlayerProfile {
    execute(managerId: string): Promise<PlayerProfileResponse>;
}

export interface IGetPlayerStats {
    execute(managerId: string): Promise<PopulatedPlayer>;
}

export interface IUpdatePlayerProfile {
    execute(updateData: PlayerUpdateDTO, file?: File): Promise<PlayerProfileResponse>;
}

export interface IUpdatePlayerFields {
    execute(updateData: PlayerProfileFieldDTO): Promise<PlayerProfileResponse>;
}

export interface IGetViewerProfile {
    execute(userId: string): Promise<UserResponseDTO>;
}

export interface IUpdateViewerProfile {
    execute(updateData: UserUpdateDTO, file?: File): Promise<UserResponseDTO>;
}