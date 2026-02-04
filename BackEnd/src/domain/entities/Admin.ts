import { Theme } from "../../domain/enums/Theme.js";

export interface AdminSettings {
    theme: Theme;
    language: string;
    currency: string;
}

export interface Admin {
    email: string;
    firstName: string;
    lastName: string;
    role: "admin";
    password: string;
    settings: AdminSettings;
    wallet: number;
    refreshToken?: string | null;
}

export interface AdminResponse extends Admin {
    _id: string;
}


export interface AdminEntity {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin";
  wallet: number;
}
