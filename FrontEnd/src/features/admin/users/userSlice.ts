import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState, type Player} from "./userTypes";
import { fetchManagers, fetchPlayers, fetchViewers, userStatusChange } from "./userThunks";
import type { User } from "../../../types/User";

const userSlice = createSlice({
    name: "users",
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
                state.viewers = action.payload.users;
                state.totalCount = action.payload.totalCount;
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
            .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<{users : Player[], totalCount : number}>) => {
                state.loading = false;
                state.players = action.payload.users;
                state.totalCount = action.payload.totalCount;
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
            .addCase(fetchManagers.fulfilled, (state, action: PayloadAction<{users : User[], totalCount : number}>) => {
                state.loading = false;
                state.managers = action.payload.users;
                state.totalCount = action.payload.totalCount;

            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            })

            // change user status
            .addCase(userStatusChange.pending, (state) => {
                // state.loading = true;
                state.error = null;
            })
            .addCase(userStatusChange.fulfilled, (state, action) => {
                // state.loading = false;
                console.log(action.payload)
                switch (action.payload.role) {
                    case "viewer":
                        state.viewers = action.payload.users;
                        state.totalCount = action.payload.totalCount;
                        break;
                    case "player":
                        state.players = action.payload.users;
                        break;
                    case "manager":
                        state.managers = action.payload.users;
                        break;
                }
            })
            .addCase(userStatusChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Something went wrong";
            });
    },
});

export default userSlice.reducer;