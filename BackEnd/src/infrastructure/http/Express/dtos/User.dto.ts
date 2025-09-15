import { PersistedUser } from "@shared/types/Types";

export interface UserResponseDTO {
    _id: string;
    userId : string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
    settings: {
        theme: string;
        language: string;
        currency: string;
    };
    wallet: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Mapper function
export const toUserResponseDTO = (user: PersistedUser): UserResponseDTO => {
    return {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        phone: user.phone,
        settings: {
            theme: user.settings.theme,
            language: user.settings.language,
            currency: user.settings.currency,
        },
        wallet: user.wallet,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
