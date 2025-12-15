import { API_PREFIX } from "../../utils/api";

export const CHAT_ROUTES = {
    GET_MESSAGES: (teamId : string) => `${API_PREFIX}/player/messages/${teamId}`,
} as const;