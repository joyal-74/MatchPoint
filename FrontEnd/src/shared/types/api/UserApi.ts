import type { Gender } from "../../../core/domain/types/UserRoles";

export interface ApiUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    wallet?: number;
    phone?: string;
    password?: string;
    gender: Gender;
    sport?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    settings?: {
        location?: string;
        country?: string;
        theme?: string;
        language?: string;
        currency?: string;
    };
}

export interface UserRegister {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    gender: Gender;
    phone: string;
    sport?: string;
}