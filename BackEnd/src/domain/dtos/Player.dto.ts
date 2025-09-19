import { ThemeType, RoleType, GenderType } from "domain/enums";

export interface PlayerSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface PlayerResponseDTO {
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