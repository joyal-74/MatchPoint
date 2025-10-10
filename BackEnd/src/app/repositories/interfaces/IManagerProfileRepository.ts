import { ManagerResponseDTO, ManagerUpdateDTO } from "domain/dtos/Manager.dto";
import { File } from "domain/entities/File";


export interface IGetManagerProfile {
    execute(managerId: string): Promise<ManagerResponseDTO>;
}

export interface IUpdateManagerProfile {
    execute(updateData: ManagerUpdateDTO, file?: File): Promise<ManagerResponseDTO>;
}