import type { Theme } from "../types/UserRoles";

export interface AdminSettings {
    theme: Theme;
    language: string;
    currency: string;
}

export interface Admin {
    _id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    wallet: number;
    settings: AdminSettings;
    createdAt?: Date;
    updatedAt?: Date;
}