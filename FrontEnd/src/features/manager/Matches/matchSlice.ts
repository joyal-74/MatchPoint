import { createSlice } from "@reduxjs/toolkit";
import { loadMatchDashboard, saveMatchData } from "./matchThunks";
import type { Team, Match } from "./matchTypes";

interface MatchState {
    match: Match | null,
    teamA: Team | null,
    teamB: Team | null,
    loading: boolean,
    error: string | undefined
};


const initialState : MatchState = {
    match: null,
    teamA: null,
    teamB: null,
    loading: false,
    error: undefined
};

const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMatchDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMatchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.match = action.payload.match;
                state.teamA = action.payload.teamA;
                state.teamB = action.payload.teamB;
            })
            .addCase(loadMatchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(saveMatchData.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveMatchData.fulfilled, (state, action) => {
                state.loading = false;
                state.match = action.payload;
            })
            .addCase(saveMatchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default matchSlice.reducer;