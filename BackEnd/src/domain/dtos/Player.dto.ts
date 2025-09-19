import { ThemeType, RoleType, GenderType } from "domain/enums";
import { UsersResponseDTO } from "./User.dto";

export interface PlayerSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface PlayerResponseDTO extends UsersResponseDTO {
    sports : string
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