import { AdminToResponseDTO } from "./Admin.dto";
import { UserResponseDTO } from "./User.dto";

export interface LoginDTOUser {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDTO;
}

export interface LoginDTOAdmin {
    accessToken: string;
    refreshToken: string;
    admin: AdminToResponseDTO;
}