import { UserRole } from "domain/enums/Roles";
import { GenderType, ThemeType, RoleType } from "../enums";

export interface UserSettings {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface User {
    userId: string;
    email: string;
    profileImage: string;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    gender: GenderType;
    phone: string;
    password: string;
    bio: string;
    settings: UserSettings;
    wallet: number;
    refreshToken?: string | null;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRegister {
    userId: string;
    email: string;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    phone: string;
    gender: GenderType;
    password: string;
    settings: UserSettings;
    wallet: number;
    isActive: boolean;
    isVerified: boolean;
    sport?: string
}

export interface UserResponse extends User {
    _id: string;
    sport?: string;
    profile?: Record<string, string | number | boolean | null>;
}


export interface UserEntity {
    _id: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    role: UserRole;
    gender: GenderType;
    phone: string;
    wallet: number;
    profileImage?: string;
    sport?: string;
}
