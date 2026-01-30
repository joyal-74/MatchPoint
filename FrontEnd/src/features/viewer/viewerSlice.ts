import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/User";
import { fetchLiveMatches, fetchTournaments, fetchViewerData, updateViewerData } from "./viewerThunks";
import type { Tournament } from "../manager/managerTypes";
import type { Match } from "../../domain/match/types";

interface viewerState {
    allTournaments: Tournament[];
    totalPages : number ;
    viewer: User | null;
    loading: boolean;
    liveMatches: Match[];
    error: string | null;
}

const initialState: viewerState = {
    allTournaments: [],
    totalPages : 0,
    viewer: null,
    liveMatches: [],
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
            })


            .addCase(fetchLiveMatches.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLiveMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.liveMatches = action.payload;
            })
            .addCase(fetchLiveMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "Failed to load matches";
            })

            .addCase(fetchTournaments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTournaments.fulfilled, (state, action) => {
                state.loading = false;
                state.allTournaments = action.payload.tournaments;
                state.totalPages = action.payload.total;
            })
            .addCase(fetchTournaments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Failed to fetch tournaments";
            })

    },
});



export default viewerSlice.reducer;