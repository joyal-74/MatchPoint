import { createSlice } from "@reduxjs/toolkit";
import { fetchPlayerData, getMyTeams, updatePlayerData, updatePlayerProfileData } from "./playerThunks";
import type { Team } from "../../components/player/Teams/Types";
import type { Player } from "../../types/Player";


interface playerState {
    teams: Team[];
    player : Player | null;
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

        builder
            .addCase(updatePlayerData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlayerData.fulfilled, (state, action) => {
                state.player = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updatePlayerData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team get failed";
            });

        builder
            .addCase(updatePlayerProfileData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlayerProfileData.fulfilled, (state, action) => {
                state.player = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updatePlayerProfileData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Team get failed";
            });
    },
});



export default playerSlice.reducer;