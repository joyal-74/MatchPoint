import { Theme } from "../../domain/enums/Theme";

export interface AdminSettingsDTO {
    theme: Theme;
    language: string;
    currency: string;
}

export interface AdminToResponseDTO {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role :string;
    wallet: number;
}
