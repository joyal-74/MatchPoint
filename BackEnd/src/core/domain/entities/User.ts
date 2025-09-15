import type { UserRole, Gender, Theme } from "../types/UserRoles";

export interface UserSettings {
    location?: string;
    country?: string;
    theme: Theme;
    language: string; 
    currency: string;
}

// Base User type
export interface User {
    userId: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
    password : string;
    settings: UserSettings;
    wallet: number;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
