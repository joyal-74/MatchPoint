import { ThemeType, RoleType, GenderType } from "domain/enums";
import { UserResponseDTO, UsersResponseDTO } from "./User.dto";

export interface PlayerSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface PlayerResponseDTO extends UserResponseDTO {
    sport : string;
}

export interface PlayersResponseDTO extends UsersResponseDTO {
    sport: string
}

export interface PlayersResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    sport: string;
    first_name: string;
    last_name: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
    createdAt: Date
}

export interface PlayerRegisterResponseDTO {
    _id: string;
    userId: string;
    email: string;
    sport: string;
    role: RoleType;
    first_name: string;
    last_name: string;
}

export interface PlayerUpdateDTO {
    _id: string;
    userId: string;
    email: string;
    logo: string;
    phone: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    username: string;
    gender: GenderType;
}