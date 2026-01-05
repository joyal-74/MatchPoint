import type { SignupRole } from "../../types/UserRoles";
import { API_PREFIX } from "../../utils/api"; 

export const ADMIN_ROUTES = {
    DASHBOARD: `${API_PREFIX}/admin/dashboard/stats`,
    VIEWERS: `${API_PREFIX}/admin/viewers`,
    PLAYERS: `${API_PREFIX}/admin/players`,
    MANAGERS: `${API_PREFIX}/admin/managers`,
    TEAMS: `${API_PREFIX}/admin/teams`,
    TRANSACTIONS: `${API_PREFIX}/admin/transactions`,
    TOURNAMENTS: `${API_PREFIX}/admin/tournaments`,
    TEAM_DETAILS: (id: string) => `${API_PREFIX}/admin/team/${id}`,
    TOURNAMNET_DETAILS: (id: string) => `${API_PREFIX}/admin/tournament/${id}`,
    TRANSACTION_DETAILS: (id: string) => `${API_PREFIX}/admin/transactions/${id}`,
    MANAGER_DETAILS: (id: string) => `${API_PREFIX}/admin/managers/${id}`,
    PLAYER_DETAILS: (id: string) => `${API_PREFIX}/admin/players/${id}`,
    VIEWER_DETAILS: (id: string) => `${API_PREFIX}/admin/viewers/${id}`,
    USER_STATUS_CHANGE: (role: SignupRole, userId: string) => `${API_PREFIX}/admin/${role}/${userId}/status`,
    TEAM_STATUS_CHANGE: (teamId: string) => `${API_PREFIX}/admin/team/${teamId}/status`,
    TEAM_STATUS_TOGGLE: (teamId: string) => `${API_PREFIX}/admin/team/${teamId}/toggle`,
    TOURNAMENT_STATUS_TOGGLE: (tourId: string) => `${API_PREFIX}/admin/tournament/${tourId}/toggle`,
    TOURNAMENT_STATUS_CHANGE: (tournamentId: string) => `${API_PREFIX}/admin/tournament/${tournamentId}/status`,
    USER_BLOCK_STATUS: (userId: string) => `${API_PREFIX}/admin/user/${userId}/blockStatus`,
} as const;