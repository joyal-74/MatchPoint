import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Tournament } from "../../manager/managerTypes";
import {
    fetchLiveMatches,
    fetchTournaments,
    tournamentDetails,
    fetchTournamentMatches,
    fetchTournamentPointsTable,
    fetchTournamentStats
} from "./tournamentThunks";
import type { Match, TournamentMatch } from "../playerTypes";
import type { PointsRow, TournamentStats } from "./tournamentType";


interface TournamentState {
    allTournaments: Tournament[];
    selectedTournament: Tournament | null;
    liveMatches: Match[];
    matches: TournamentMatch[];
    pointsTable: PointsRow[];
    stats: TournamentStats;
    loading: boolean;
    error: string | null;
    // Separate loading/error for tournament-specific data
    matchesLoading: boolean;
    matchesError: string | null;
    pointsTableLoading: boolean;
    pointsTableError: string | null;
    statsLoading: boolean;
    statsError: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: TournamentState = {
    allTournaments: [],
    selectedTournament: null,
    liveMatches: [],
    matches: [],
    pointsTable: [],
    stats: {} as TournamentStats, 
    loading: false,
    error: null,
    matchesLoading: false,
    matchesError: null,
    pointsTableLoading: false,
    pointsTableError: null,
    statsLoading: false,
    statsError: null,
    totalPages: 0,
    currentPage: 1,
};

const tournamentSlice = createSlice({
    name: "tournaments",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearSelectedTournament: (state) => {
            state.selectedTournament = null;
        },
        // Optional: Clear tournament-specific data
        clearTournamentData: (state) => {
            state.matches = [];
            state.pointsTable = [];
            state.stats = {} as TournamentStats;
            state.matchesLoading = false;
            state.matchesError = null;
            state.pointsTableLoading = false;
            state.pointsTableError = null;
            state.statsLoading = false;
            state.statsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Existing: fetchTournaments
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

            // Existing: fetchLiveMatches
            .addCase(fetchLiveMatches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLiveMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.liveMatches = action.payload;
            })
            .addCase(fetchLiveMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Failed to fetch live matches";
            })

            // Existing: tournamentDetails
            .addCase(tournamentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(tournamentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTournament = action.payload;
            })
            .addCase(tournamentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || "Failed to fetch tournament details";
            })

            // New: fetchTournamentMatches
            .addCase(fetchTournamentMatches.pending, (state) => {
                state.matchesLoading = true;
                state.matchesError = null;
            })
            .addCase(fetchTournamentMatches.fulfilled, (state, action) => {
                state.matchesLoading = false;
                state.matches = action.payload;
            })
            .addCase(fetchTournamentMatches.rejected, (state, action) => {
                state.matchesLoading = false;
                state.matchesError = action.payload || action.error.message || "Failed to fetch tournament matches";
            })

            // New: fetchTournamentPointsTable
            .addCase(fetchTournamentPointsTable.pending, (state) => {
                state.pointsTableLoading = true;
                state.pointsTableError = null;
            })
            .addCase(fetchTournamentPointsTable.fulfilled, (state, action) => {
                state.pointsTableLoading = false;
                state.pointsTable = action.payload;
            })
            .addCase(fetchTournamentPointsTable.rejected, (state, action) => {
                state.pointsTableLoading = false;
                state.pointsTableError = action.payload || action.error.message || "Failed to fetch points table";
            })

            // New: fetchTournamentStats
            .addCase(fetchTournamentStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })
            .addCase(fetchTournamentStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchTournamentStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.payload || action.error.message || "Failed to fetch stats";
            });
    },
});

export const { setPage, clearSelectedTournament, clearTournamentData } = tournamentSlice.actions;
export default tournamentSlice.reducer;