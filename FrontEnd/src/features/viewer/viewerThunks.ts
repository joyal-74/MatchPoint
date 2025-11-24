import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/createApiThunk";
import { viewerEndpoints } from "../../api/endpoints/viewerEndpoints";
import type { UpdateUserDataPayload } from "../manager/managerTypes";
import { setUser } from "../auth";

export const fetchViewerData = createAsyncThunk(
    "manager/fetchViewerData",
    createApiThunk(viewerEndpoints.fetchViewerData)
);

export const updateViewerData = createAsyncThunk(
    "manager/updateViewerData",
    createApiThunk(async (data: UpdateUserDataPayload, dispatch) => {
        const response = await viewerEndpoints.updateViewerData(data);
        dispatch(setUser(response));
        return response;
    })
);