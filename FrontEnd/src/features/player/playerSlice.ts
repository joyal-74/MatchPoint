import { createSlice } from "@reduxjs/toolkit";
import { fetchPlayerData, getMyTeams } from "./playerThunks";
import type { Team } from "../../components/player/Teams/Types";
import type { User } from "../../types/User";


interface playerState {
    teams: Team[];
    player : User | null;
    totalTeams: number;
    loading: boolean;
    error: string | null;
}

const initialState: playerState = {
    teams: [],
    player : null,
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

        builder
            .addCase(fetchPlayerData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlayerData.fulfilled, (state, action) => {
                state.player = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchPlayerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team get failed";
            });
    },
});



export default playerSlice.reducer;