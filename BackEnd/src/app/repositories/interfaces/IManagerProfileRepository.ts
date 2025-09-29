import { ManagerResponseDTO, ManagerUpdateDTO } from "domain/dtos/Manager.dto";
import { File } from "domain/entities/File";


export interface IUpdateManagerProfile {
    execute(updateData: ManagerUpdateDTO, file?: File): Promise<{ user: ManagerResponseDTO }>;
}