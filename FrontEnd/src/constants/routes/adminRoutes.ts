import type { SignupRole } from "../../types/UserRoles";
import { API_PREFIX } from "../../utils/api"; 

export const ADMIN_ROUTES = {
    VIEWERS: `${API_PREFIX}/admin/viewers`,
    PLAYERS: `${API_PREFIX}/admin/players`,
    MANAGERS: `${API_PREFIX}/admin/managers`,
    MANAGER_DETAILS: (id: string) => `${API_PREFIX}/admin/managers/${id}`,
    PLAYER_DETAILS: (id: string) => `${API_PREFIX}/admin/players/${id}`,
    VIEWER_DETAILS: (id: string) => `${API_PREFIX}/admin/viewers/${id}`,
    USER_STATUS_CHANGE: (role: SignupRole, userId: string) => `${API_PREFIX}/admin/${role}/${userId}/status`,
    USER_BLOCK_STATUS: (userId: string) => `${API_PREFIX}/admin/user/${userId}/blockStatus`,
} as const;