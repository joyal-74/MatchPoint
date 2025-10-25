import type { UserRole, Gender, Theme, SignupRole } from "../types/UserRoles";

export interface UserSettings {
    location?: string;
    country?: string;
    theme: Theme;
    language: string;
    currency: string;
}


export interface LoginUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string
    role: UserRole;
    wallet: number;
    isActive : boolean;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    email: string;
    password?: string;
    phone?: string;
    gender?: Gender;
    sport?: string;
    profileImage: string
    role: UserRole;
    wallet: number;
    settings: UserSettings;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}


// Registration payload
export interface RegisterUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: Gender;
    password: string;
    confirmPassword: string;
    role: SignupRole;
    sport?: string;
}


export interface LoginGoogleResult {
    success: boolean;
    message?: string;
    errors?: { global?: string };
    tempToken?: string;
    user?: LoginUser;
    accessToken?: string;
    refreshToken?: string;
}

export type AuthUser = Pick<User, "_id" | "firstName" | "lastName" | "email" | "role" | "phone" | "gender" | "profileImage" | "isActive">;