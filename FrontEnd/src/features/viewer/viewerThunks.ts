import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/createApiThunk";
import { viewerEndpoints } from "../../api/endpoints/viewerEndpoints";

export const fetchViewerData = createAsyncThunk(
    "manager/fetchViewerData",
    createApiThunk(viewerEndpoints.fetchViewerData)
);

export const updateViewerData = createAsyncThunk(
    "manager/updateViewerData",
    createApiThunk(viewerEndpoints.updateViewerData)
);