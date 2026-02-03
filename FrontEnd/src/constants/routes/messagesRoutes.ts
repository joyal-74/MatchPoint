import { API_PREFIX } from "../../utils/api";

export const MESSAGES_ROUTES = {
    GET_MESSAGES: (chatId: string) => `${API_PREFIX}/chat/${chatId}/messages`,
    SAVE_MESSAGES: (chatId: string) => `${API_PREFIX}/chat/${chatId}/messages`,
} as const;