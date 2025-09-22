import type { User } from '../../types/User';
import type { ApiUser, UserRegister } from "../../types/api/UserApi";
import type { UserRole, Theme, Gender } from '../../types/UserRoles';
import type { ApiAdmin } from '../../types/api/AdminApi';
import type { Admin, AdminSettings } from '../../types/Admin';

export const mapApiUserToDomain = (apiUser: ApiUser): User => ({  // backend to front
    _id: apiUser._id,
    email: apiUser.email,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    role: apiUser.role as UserRole,
    wallet: apiUser.wallet ?? 0,
    phone: apiUser.phone ?? "",
    gender: apiUser.gender as Gender,
    settings: {
        location: apiUser.settings?.location,
        country: apiUser.settings?.country,
        theme: apiUser.settings?.theme as Theme,
        language: apiUser.settings?.language ?? "en",
        currency: apiUser.settings?.currency ?? "USD",
    },
    isActive: apiUser.is_active ?? true,
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined,
    updatedAt: apiUser.updated_at ? new Date(apiUser.updated_at) : undefined,

});


export const mapDomainUserToApi = (user: Partial<User>): Partial<ApiUser> => {
    return {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        wallet: user.wallet,
        phone: user.phone,
        is_active: user.isActive,
        created_at: user.createdAt?.toISOString(),
        updated_at: user.updatedAt?.toISOString(),
        settings: user.settings
            ? {
                location: user.settings.location,
                country: user.settings.country,
                theme: user.settings.theme,
                language: user.settings.language,
                currency: user.settings.currency,
            }
            : undefined,
    };
};

export const mapUserForSignup = (user: UserRegister): Partial<ApiUser> => ({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: user.password,
    role: user.role,
    gender: user.gender,
    sport: user.sport,
    phone: user.phone,
});

export const mapApiAdminToDomain = (apiAdmin: ApiAdmin): Admin => ({
    _id: apiAdmin._id,
    email: apiAdmin.email,
    first_name: apiAdmin.first_name,
    last_name: apiAdmin.last_name,

    wallet: apiAdmin.wallet ?? 0,

    settings: {
        theme: (apiAdmin.settings?.theme as AdminSettings["theme"]) ?? "light",
        language: apiAdmin.settings?.language ?? "en",
        currency: apiAdmin.settings?.currency ?? "USD",
    },

    password: apiAdmin.password,
    createdAt: undefined,
    updatedAt: undefined,
});
