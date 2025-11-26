export const CHAT_ROUTES = {
    GET_MESSAGES: (teamId : string) => `/player/messages/${teamId}`,
} as const;