import { API_PREFIX } from "../../utils/api";

export const NOTIFICATION_ROUTES = {
    GET_NOTIFICATIONS: (userId: string) => `${API_PREFIX}/notifications/${userId}`,
    GET_UNREAD_COUNT: (userId: string) => `${API_PREFIX}/notifications/${userId}/unread`,
    MARK_AS_READ: `${API_PREFIX}/notifications/mark-read`,
    MARK_ALL_AS_READ: `${API_PREFIX}/notifications/mark-all-read`,
} as const;