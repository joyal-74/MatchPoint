import { ThemeType, RoleType, GenderType } from "domain/enums";

export interface UserSettingsDTO {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}


export interface UserLoginResponseDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    wallet: number;
    role: RoleType;
    profileImage?: string;
    isActive: boolean;
    createdAt: Date,

}

export interface ILoginSocialUserResponse {
    isNewUser: boolean;
    tempToken?: string;
    authProvider?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
}

export interface UserResponseDTO {
    _id: string;
    userId: string;
    email: string;
    profileImage?: string | null;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    sport?: string;
    gender: GenderType;
    phone: string | null;
    wallet: number;
    isActive: boolean,
    createdAt: Date;

}

export interface UserUpdateDTO {
    _id: string;
    userId: string;
    email: string;
    logo: string;
    phone: string;
    role: RoleType;
    firstName: string;
    lastName: string;
    username: string;
    gender: GenderType;
}