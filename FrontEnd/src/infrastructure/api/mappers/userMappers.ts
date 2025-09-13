import type { User } from '../../../core/domain/entities/User';
import type { Player } from '../../../core/domain/entities/Player';
import type { ApiUser, UserRegister } from "../../../shared/types/api/UserApi";
import type { ApiPlayer } from "../../../shared/types/api/PlayerApi";
import type { UserRole, Theme } from "../../../core/domain/types/UserRoles";

export const mapApiUserToDomain = (apiUser: ApiUser): User => ({  // backend to front
    id: apiUser.id,
    email: apiUser.email,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    role: apiUser.role as UserRole,
    wallet: apiUser.wallet ?? 0,
    phone: apiUser.phone ?? "",
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

export const mapApiPlayerToDomain = (apiPlayer: ApiPlayer): Player => ({
    ...mapApiUserToDomain(apiPlayer),
    sport: apiPlayer.sport,
    profile: apiPlayer.profile,
    career_stats: apiPlayer.career_stats,
    tournaments: apiPlayer.tournaments,
});

export const mapDomainUserToApi = (user: Partial<User>): Partial<ApiUser> => {
    return {
        id: user.id,
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
