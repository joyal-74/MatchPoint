import type { UserRole, Gender, Theme } from "../types/UserRoles";

export interface UserSettings {
    location?: string;
    country?: string;
    theme: Theme;
    language: string;
    currency: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone: string;
    gender?: Gender;
    role: UserRole;
    wallet: number;
    settings: UserSettings;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
