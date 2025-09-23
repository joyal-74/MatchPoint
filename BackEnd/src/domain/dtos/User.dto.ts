import { ThemeType, RoleType, GenderType, AllRole } from "domain/enums";

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
    role: AllRole;
    first_name: string;
    last_name: string;
    username: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
    logo?: string | null;
    sport?: string;
}

export interface UsersResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
    createdAt: Date,
    isActive: boolean,
}

export interface UserRegisterResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    first_name: string;
    last_name: string;
}

export interface UserUpdateDTO {
    _id: string;
    userId: string;
    email: string;
    logo: string;
    phone: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    username : string;
    gender : GenderType;
}