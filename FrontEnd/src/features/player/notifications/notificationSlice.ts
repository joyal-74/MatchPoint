import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "./notificationTypes";
import { markAllNotificationRead, markNotificationRead } from "./notificationThunks";

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
    },
    extraReducers(builder) {
        builder
            .addCase(markAllNotificationRead.fulfilled, (state) => {
                state.items.forEach(item => { item.isRead = true; });
                state.unreadCount = 0;
            })

            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const updatedNotification = action.payload;

                const index = state.items.findIndex(n => n._id === updatedNotification._id);
                if (index !== -1) {
                    if (!state.items[index].isRead) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                    state.items[index] = updatedNotification;
                }
            })
    },
});

export const { setNotifications, addNotification, markAsRead, setUnreadCount, markAllAsRead, clearAllNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;