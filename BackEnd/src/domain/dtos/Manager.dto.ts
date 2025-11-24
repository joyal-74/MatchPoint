import { ThemeType, RoleType, GenderType } from "domain/enums";

export interface ManagerSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface ManagerResponseDTO {
    _id: string;
    userId: string;
    email: string;
    profileImage?: string | null;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
}

export interface ManagerLoginResponseDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    wallet: number;
    role: RoleType;
    profileImage?: string;
}


export interface ManagerUpdateDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    gender: GenderType;
    profileImage?: string;
}