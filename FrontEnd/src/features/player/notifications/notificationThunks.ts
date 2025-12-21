import { createAsyncThunk } from "@reduxjs/toolkit";
import { setNotifications, setUnreadCount } from "./notificationSlice";
import { createApiThunk } from "../../../utils/createApiThunk";
import { playerEndpoints } from "../../../api/endpoints/playerEndpoints";


export const fetchNotifications = createAsyncThunk(
    "player/fetchNotifications",
    createApiThunk(async (playerId: string, dispatch) => {
        const response = await playerEndpoints.fetchNotifications(playerId);
        dispatch(setNotifications(response));
        return response;
    })
);

export const fetchUnreadCount = createAsyncThunk(
    "player/fetchUnreadCount ",
    createApiThunk(async (playerId : string, dispatch) => {
        const response = await playerEndpoints.setUnreadCount(playerId);
        dispatch(setUnreadCount(response));
        return response;
    })
);
