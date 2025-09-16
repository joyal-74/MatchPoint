import { Admin } from "@core/domain/entities/Admin";

export interface AdminResponseDTO {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    wallet: number;
    settings: {
        theme: string;
        language: string;
        currency: string;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export function toAdminResponseDTO(admin: Admin & { _id: any }): AdminResponseDTO {
    return {
        _id: admin._id.toString(),
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        wallet: admin.wallet,
        settings: {
            theme: admin.settings.theme,
            language: admin.settings.language,
            currency: admin.settings.currency,
        },
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
    };
}
