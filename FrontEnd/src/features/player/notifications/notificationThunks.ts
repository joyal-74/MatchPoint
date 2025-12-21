import { createAsyncThunk } from "@reduxjs/toolkit";
import { setNotifications, setUnreadCount } from "./notificationSlice";
import { createApiThunk } from "../../../utils/createApiThunk";
import { notificationEndpoints } from "../../../api/endpoints/notificationEndpoints";


export const fetchNotifications = createAsyncThunk(
    "user/fetchNotifications",
    createApiThunk(async (userId: string, dispatch) => {
        const response = await notificationEndpoints.fetchNotifications(userId);
        dispatch(setNotifications(response));
        return response;
    })
);

export const fetchUnreadCount = createAsyncThunk(
    "user/fetchUnreadCount ",
    createApiThunk(async (userId : string, dispatch) => {
        const response = await notificationEndpoints.setUnreadCount(userId);
        dispatch(setUnreadCount(response));
        return response;
    })
);
