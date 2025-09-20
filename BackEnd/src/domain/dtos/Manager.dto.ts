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
    logo: string | null;
    role: RoleType;
    first_name: string;
    last_name: string;
    username : string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
}

export interface ManagersResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    username : string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
    createdAt : string,
}

export interface ManagerRegisterResponseDTO {
    _id: string;
    userId: string;
    email: string;
    first_name: string;
    last_name: string;
    username : string;
    role: RoleType; 
}


export interface ManagerUpdateDTO {
    _id : string;
    first_name: string;
    last_name: string;
    email: string;
    phone : string;
    username : string;
    gender: GenderType;
    logo?: string;
}