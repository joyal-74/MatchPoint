import { PlayerResponseDTO, PlayerUpdateDTO } from "domain/dtos/Player.dto";
import { File } from "domain/entities/File";


export interface IGetPlayerProfile {
    execute(managerId: string): Promise<PlayerResponseDTO>;
}

export interface IUpdatePlayerProfile {
    execute(updateData: PlayerUpdateDTO, file?: File): Promise<PlayerResponseDTO>;
}