import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchNotifications, fetchUnreadCount } from "../features/player/notifications/notificationThunks";

export function useNotifications(userId?: string) {
    const dispatch = useAppDispatch();
    const unreadCount = useAppSelector(
        state => state.notifications.unreadCount
    );

    const notifications = useAppSelector(
        state => state.notifications.items
    );

    const [isOpen, setIsOpen] = useState(false);

    // Fetch notifications when user changes
    useEffect(() => {
        if (!userId) return;

        dispatch(fetchNotifications(userId));
        dispatch(fetchUnreadCount(userId));
    }, [userId, dispatch]);

    const toggle = () => setIsOpen(prev => !prev);
    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    const refresh = () => {
        if (!userId) return;
        dispatch(fetchNotifications(userId));
        dispatch(fetchUnreadCount(userId));
    };

    return {
        notifications,
        unreadCount,
        isOpen,
        toggle,
        open,
        close,
        refresh
    };
}
