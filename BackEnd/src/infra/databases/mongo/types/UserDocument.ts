import { HydratedDocument } from "mongoose";

export interface UserSchemaType {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password?: string;
    bio?: string;
    phone: string;
    gender?: string;
    role: string;
    refreshToken?: string | null;
    wallet: number;
    sport?: string;
    settings: {
        location?: string;
        country?: string;
        theme: string;
        language: string;
        currency: string;
    };
    isActive: boolean;
    isVerified: boolean;
    profileImage?: string | null;
    authProvider?: string | null;
    subscription: string;
}

export type UserDocument = HydratedDocument<UserSchemaType>;