import { NOTIFICATION_ROUTES } from "../../constants/routes/notificationRoutes";
import type { Notification } from "../../features/player/notifications/notificationTypes";
import axiosClient from "../http/axiosClient";

export const notificationEndpoints = {

    fetchNotifications: async (playerId: string): Promise<Notification[]> => {
        const { data } = await axiosClient.get(NOTIFICATION_ROUTES.GET_NOTIFICATIONS(playerId))
        return data.data;
    },

    setUnreadCount: async (playerId: string): Promise<number> => {
        const { data } = await axiosClient.get(NOTIFICATION_ROUTES.GET_UNREAD_COUNT(playerId))
        return data.data;
    },

    markNotificationRead: async ({notificationId, userId}:{notificationId: string, userId : string}): Promise<Notification> => {
        const { data } = await axiosClient.patch(NOTIFICATION_ROUTES.MARK_AS_READ, {notificationId, userId});
        console.log(data)
        return data.data;
    },

    markAllNotificationRead: async (playerId: string): Promise<number> => {
        const { data } = await axiosClient.patch(NOTIFICATION_ROUTES.MARK_ALL_AS_READ, {playerId});
        console.log(data)
        return data.data;
    },
}