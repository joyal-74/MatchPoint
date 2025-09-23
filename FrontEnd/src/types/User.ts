import type { UserRole, Gender, Theme, SignupRole } from "../types/UserRoles";

export interface UserSettings {
    location?: string;
    country?: string;
    theme: Theme;
    language: string;
    currency: string;
}

// Full DB user (all roles)
export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone?: string;
    gender?: Gender;
    sport?: string;
    role: UserRole;
    wallet: number;
    settings: UserSettings;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Registration payload
export interface RegisterUser {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: Gender;
    password: string;
    confirmPassword: string;
    role: SignupRole;
    sport?: string;
}


export type AuthUser = Pick<User, "_id" | "first_name" | "last_name" | "email" | "role" | "phone" | "gender">;