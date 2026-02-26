import { ThemeType, RoleType, GenderType } from "../../domain/enums/index";

export interface UmpireSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface UmpireResponseDTO {
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

export interface UmpireLoginResponseDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    wallet: number;
    role: RoleType;
    profileImage?: string;
}


export interface UmpireUpdateDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    gender: GenderType;
    profileImage?: string;
}
