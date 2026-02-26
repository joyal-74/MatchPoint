import { API_PREFIX } from "../../utils/api";

export const MESSAGES_ROUTES = {
    GET_MESSAGES: (chatId: string) => `${API_PREFIX}/chat/${chatId}/messages`,
    SAVE_MESSAGES: (chatId: string) => `${API_PREFIX}/chat/${chatId}/messages`,
    GET_USER_TEAMS: (userId: string, role: string) => `${API_PREFIX}/chat/${userId}/${role}/teams`,
    GET_MY_TEAM: (teamId: string) => `${API_PREFIX}/chat/team/${teamId}/details`,
} as const;