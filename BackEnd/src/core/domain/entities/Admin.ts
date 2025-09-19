import type { Theme } from "../types/UserRoles";

export interface AdminSettings {
    theme: Theme;
    language: string;
    currency: string;
}


export interface Admin {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    settings: AdminSettings;
    wallet: number;
    createdAt: Date;
    updatedAt: Date;
}
