import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/createApiThunk";
import { viewerEndpoints } from "../../api/endpoints/viewerEndpoints";
import type { UpdateUserDataPayload } from "../manager/managerTypes";
import { setUser } from "../auth";

export const fetchViewerData = createAsyncThunk(
    "viewer/fetchViewerData",
    createApiThunk(viewerEndpoints.fetchViewerData)
);


export const fetchLiveMatches  = createAsyncThunk(
    "viewer/fetchLiveMatches ",
    createApiThunk(viewerEndpoints.fetchLiveMatches )
);

export const fetchMatchUpdates  = createAsyncThunk(
    "viewer/fetchMatchUpdates ",
    createApiThunk(viewerEndpoints.fetchMatchUpdates )
);

export const updateViewerData = createAsyncThunk(
    "viewer/updateViewerData",
    createApiThunk(async (data: UpdateUserDataPayload, dispatch) => {
        const response = await viewerEndpoints.updateViewerData(data);
        dispatch(setUser(response));
        return response;
    })
);