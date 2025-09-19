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
    role: RoleType;
    first_name: string;
    last_name: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
}

export interface ManagerRegisterResponseDTO {
    _id: string;
    userId: string;
    email: string;
    first_name: string;
    last_name: string;
    role: RoleType; 
}
