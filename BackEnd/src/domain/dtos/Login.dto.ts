import { AdminToResponseDTO } from "./Admin.dto.js";
import { UserResponseDTO } from "./User.dto.js";

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
