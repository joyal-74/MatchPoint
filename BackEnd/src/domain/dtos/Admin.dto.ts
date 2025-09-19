import { Theme } from "domain/enums/Theme";

export interface AdminSettingsDTO {
    theme: Theme;
    language: string;
    currency: string;
}

export interface AdminToResponseDTO {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
    role : string;
    wallet: number;
}