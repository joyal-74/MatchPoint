import type { SignupRole } from "../types/UserRoles"; 

export const ADMIN_ROUTES = {
    VIEWERS: "/admin/viewers",
    PLAYERS: "/admin/players",
    MANAGERS: "/admin/managers",
    USER_STATUS_CHANGE: (role: SignupRole, userId: string) => `/admin/${role}/${userId}/status`,
} as const;