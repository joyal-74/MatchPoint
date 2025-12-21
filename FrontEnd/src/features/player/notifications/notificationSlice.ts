import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "./notificationTypes";

interface NotificationState {
    items: Notification[];
    unreadCount: number;
    loading: boolean;
}

const initialState: NotificationState = {
    items: [],
    unreadCount: 0,
    loading: false
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<Notification[]>) {
            state.items = action.payload;
        },
        addNotification(state, action: PayloadAction<Notification>) {
            state.items.unshift(action.payload);
        },
        markAsRead(state, action: PayloadAction<string>) {
            const n = state.items.find(i => i._id === action.payload);
            if (n && !n.isRead) {
                n.isRead = true;
                state.unreadCount -= 1;
            }
        },
        markAllAsRead(state) {
            state.items.forEach(item => {
                item.isRead = true;
            });
            state.unreadCount = 0;
        },
        clearAllNotifications(state) {
            state.items = [];
            state.unreadCount = 0;
        },
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        }
    }
});

export const { setNotifications, addNotification, markAsRead, setUnreadCount, markAllAsRead, clearAllNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;