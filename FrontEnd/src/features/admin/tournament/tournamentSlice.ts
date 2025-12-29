import { createSlice } from "@reduxjs/toolkit";
import { fetchTeamDetails, fetchTeams, fetchTournaments, teamStatusChange, tournamentStatusChange, updateTeamStatus } from "./tournamentThunks";
import type { Team, TeamDetails, Tournament } from "./tournamentTypes";

interface AdminTournamentState {
    teams: Team[];
    selectedTeam: TeamDetails | null;
    tournaments: Tournament[];
    loading: boolean;
    error: string | null;
    totalCount: number;
}

const initialState: AdminTournamentState = {
    teams: [],
    selectedTeam: null,
    tournaments: [],
    loading: false,
    error: null,
    totalCount: 0,
};

const adminTournamentSlice = createSlice({
    name: "adminTournaments",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Teams ---
            .addCase(fetchTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload.teams;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch teams";
            })

            // --- Fetch Tournaments ---
            .addCase(fetchTournaments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTournaments.fulfilled, (state, action) => {
                state.loading = false;
                state.tournaments = action.payload.tournaments;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchTournaments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch tournaments";
            })

            // --- Team Status Change ---
            .addCase(teamStatusChange.pending, (state) => {
                state.loading = true;
            })
            .addCase(teamStatusChange.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.teams) {
                    state.teams = action.payload.teams;
                    state.totalCount = action.payload.totalCount;
                }
            })
            .addCase(teamStatusChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update status";
            })

            // --- Team Status Change ---
            .addCase(updateTeamStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTeamStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTeam = action.payload;
                
            })
            .addCase(updateTeamStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update status";
            })

            // --- Tournament Status Change ---
            .addCase(tournamentStatusChange.pending, (state) => {
                state.loading = true;
            })
            .addCase(tournamentStatusChange.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.tournaments) {
                    state.tournaments = action.payload.tournaments;
                    state.totalCount = action.payload.totalCount;
                }
            })
            .addCase(tournamentStatusChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update status";
            })


            .addCase(fetchTeamDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeamDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTeam = action.payload;
            })
            .addCase(fetchTeamDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update status";
            });
    },
});

export const { clearErrors } = adminTournamentSlice.actions;
export default adminTournamentSlice.reducer;