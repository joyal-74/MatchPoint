import { createSlice } from "@reduxjs/toolkit";
import { getMyTeams } from "./playerThunks";
import type { Team } from "./playerTypes";

interface playerState {
    teams: Team[];
    totalTeams: number;
    loading: boolean;
    error: string | null;
}

const initialState: playerState = {
    teams: [],
    totalTeams : 0,
    loading: false,
    error: null,
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getMyTeams
        builder
            .addCase(getMyTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyTeams.fulfilled, (state, action) => {
                state.teams = action.payload.teams;
                state.totalTeams = action.payload.totalTeams;
                state.loading = false;
                state.error = null;
            })
            .addCase(getMyTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team get failed";
            });
    },
});



export default playerSlice.reducer;