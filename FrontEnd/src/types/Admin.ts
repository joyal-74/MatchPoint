import type { UserRole, Theme } from "../types/UserRoles";

export interface AdminSettings {
    theme: Theme;
    language: string;
    currency: string;
}

export interface LoginAdmin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    settings : AdminSettings;
    profileImage: string
    role: UserRole;
    wallet: number;
    isActive : boolean;
    createdAt: Date;
}

export interface Admin {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    role: Extract<UserRole, "admin">;
    wallet: number;
    settings: AdminSettings;
    createdAt?: Date;
    updatedAt?: Date;
}
