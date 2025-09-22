import type { User } from '../User'
import type { Gender, SignupRole } from "../UserRoles";

export interface ApiUser {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    wallet?: number;
    phone?: string;
    password?: string;
    gender?: Gender;
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
    role: SignupRole;
    gender: Gender;
    phone: string;
    sport?: string;
}

export type SignupResponse = {
    user: User;
    expiresAt: string;
};

export type LoginRequest = {
    email: string;
    password: string;
}
