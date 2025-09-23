import { UserRole } from "domain/enums/Roles";
import { GenderType, ThemeType, RoleType } from "../enums";

export interface UserSettings {
    location?: string;
    country?: string;
    theme: ThemeType;
    language: string;
    currency: string;
}

export interface User {
    userId: string;
    email: string;
    logo: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    username: string;
    gender: GenderType;
    phone: string;
    password: string;
    settings: UserSettings;
    wallet: number;
    refreshToken?: string | null;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRegister {
    userId: string;
    email: string;
    role: RoleType;
    first_name: string;
    last_name: string;
    gender: GenderType;
    password: string;
    settings: UserSettings;
    wallet: number;
    isActive: boolean;
    isVerified: boolean;
}

export interface UserResponse extends User {
    _id: string;
    sport?: string;
}


export interface UserEntity {
  _id: string;
  userId: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  role: UserRole;
  gender: GenderType;
  phone: string | null;
  wallet: number;
  logo?: string | null;
  sport?: string;
}
