import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/User";
import { fetchViewerData, updateViewerData } from "./viewerThunks";

interface viewerState {
    viewer : User | null;
    loading: boolean;
    error: string | null;
}

const initialState: viewerState = {
    viewer: null,
    loading: false,
    error: null,
};

const viewerSlice = createSlice({
    name: "viewer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(fetchViewerData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchViewerData.fulfilled, (state, action) => {
                state.viewer = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchViewerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Profile update failed";
            });

        builder
            .addCase(updateViewerData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateViewerData.fulfilled, (state, action) => {
                state.viewer = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateViewerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Profile update failed";
            });
    },
});



export default viewerSlice.reducer;