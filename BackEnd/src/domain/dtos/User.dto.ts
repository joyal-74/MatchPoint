import { UserResponse } from "domain/entities/User";
import { ThemeType, RoleType, GenderType } from "domain/enums";

export interface UserSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface UserResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
}

export interface UserRegisterResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    first_name: string;
    last_name: string;
}