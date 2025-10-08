import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { fetchTeams, joinTeam } from "./teamThunks";
import { getMyTeamDetails } from "../playerThunks";
import type { Team } from "../../../components/player/Teams/Types";


interface TeamsState {
    allTeams: Team[];
    selectedTeam: Team | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: TeamsState = {
    allTeams: [],
    selectedTeam: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
};


const teamsSlice = createSlice({
    name: "teams",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },

        setSelectedTeam: (state, action: PayloadAction<Team>) => {
            state.selectedTeam = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeams.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = false;
                state.allTeams = action.payload.teams;
                state.totalPages = action.payload.totalTeams;
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch teams";
            });

        builder
            .addCase(joinTeam.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.allTeams = state.allTeams.map(t => t._id === action.payload._id ? action.payload : t);
            })
            .addCase(joinTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch teams";
            });

        builder
            .addCase(getMyTeamDetails.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyTeamDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTeam = action.payload;
            })
            .addCase(getMyTeamDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch teams";
            });
    },
});

export const { setPage, setSelectedTeam } = teamsSlice.actions;
export default teamsSlice.reducer;