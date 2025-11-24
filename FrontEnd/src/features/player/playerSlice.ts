import { createSlice } from "@reduxjs/toolkit";
import { fetchPlayerData, getMyAllTeams, updatePlayerData, updatePlayerProfileData } from "./playerThunks";
import type { Team } from "../../components/player/Teams/Types";
import type { Player } from "../../types/Player";


interface playerState {
    approvedTeams: Team[];
    pendingTeams: Team[];
    totalApprovedTeams: number;
    totalPendingTeams: number;
    totalTeams: number; // derived total
    player: Player | null;
    loading: boolean;
    error: string | null;
}

const initialState: playerState = {
    approvedTeams: [],
    pendingTeams: [],
    totalApprovedTeams: 0,
    totalPendingTeams: 0,
    totalTeams: 0,
    player: null,
    loading: false,
    error: null,
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getAllMyTeams
        builder
            .addCase(getMyAllTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyAllTeams.fulfilled, (state, action) => {
                state.approvedTeams = action.payload.approvedTeams;
                state.pendingTeams = action.payload.pendingTeams;
                state.totalApprovedTeams = action.payload.totalApprovedTeams;
                state.totalPendingTeams = action.payload.totalPendingTeams
                state.loading = false;
                state.error = null;
            })
            .addCase(getMyAllTeams.rejected, (state, action) => {
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