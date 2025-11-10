import type { SignupRole } from "../types/UserRoles";

export const ADMIN_ROUTES = {
    VIEWERS: "/admin/viewers",
    PLAYERS: "/admin/players",
    MANAGERS: "/admin/managers",
    MANAGER_DETAILS: (id: string) => `/admin/managers/${id}`,
    PLAYER_DETAILS: (id: string) => `/admin/players/${id}`,
    VIEWER_DETAILS: (id: string) => `/admin/viewers/${id}`,
    USER_STATUS_CHANGE: (role: SignupRole, userId: string) => `/admin/${role}/${userId}/status`,
} as const;