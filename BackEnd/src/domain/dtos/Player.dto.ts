import { ThemeType, RoleType, GenderType } from "../../domain/enums/index.js";
import { UserResponseDTO } from "./User.dto.js";

export interface PlayerSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface PlayerResponseDTO extends UserResponseDTO {
    sport?: string;
}

export interface PlayersResponseDTO {
    _id: string;
    userId: string;
    email: string;
    role: RoleType;
    sport: string;
    firstName: string;
    lastName: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
    createdAt: Date
}

export interface PlayerUpdateDTO {
    _id: string;
    userId: string;
    email: string;
    logo: string;
    phone: string;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    gender: GenderType;
}

export interface PlayerProfileFieldDTO {
    _id: string;
    userId : string;
    sport?: string;
    profile: Record<string, string | number | boolean | null>;
}


export interface PlayerProfileResponse {
    _id: string;
    userId: string;
    email: string;
    phone: string;
    bio: string;
    wallet: number;
    profileImage: string;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    gender: GenderType;
    sport: string;
    profile: Record<string, string | number | boolean | null>;
}
