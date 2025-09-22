import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState, type User } from "./userTypes";
import { fetchManagers, fetchPlayers, fetchViewers } from "./userThunks";


const userSlice = createSlice({
    name: "viewers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchViewers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchViewers.fulfilled, (state, action) => {
                state.loading = false;
                state.viewers = action.payload;
                state.totalCount = action.payload.length;
            })
            .addCase(fetchViewers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            })

            // All players
            .addCase(fetchPlayers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.viewers = action.payload;
            })
            .addCase(fetchPlayers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            })

            // All managers
            .addCase(fetchManagers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.viewers = action.payload;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });
    },
});

export default userSlice.reducer;