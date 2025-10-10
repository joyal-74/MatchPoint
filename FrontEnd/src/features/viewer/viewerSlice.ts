import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/User";
import { fetchViewerData, updateViewerData } from "./viewerThunks";

interface playerState {
    viewer : User | null;
    loading: boolean;
    error: string | null;
}

const initialState: playerState = {
    viewer: null,
    loading: false,
    error: null,
};

const playerSlice = createSlice({
    name: "player",
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



export default playerSlice.reducer;