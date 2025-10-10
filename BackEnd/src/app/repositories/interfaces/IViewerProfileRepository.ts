import { UserResponseDTO, UserUpdateDTO } from "domain/dtos/User.dto";
import { File } from "domain/entities/File";


export interface IGetViewerProfile {
    execute(managerId: string): Promise<UserResponseDTO>;
}

export interface IUpdateViewerProfile {
    execute(updateData: UserUpdateDTO, file?: File): Promise<UserResponseDTO>;
}