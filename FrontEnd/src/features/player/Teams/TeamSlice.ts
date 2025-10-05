import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Team } from "../playerTypes";
import { fetchTeams, joinTeam } from "./teamThunks";


interface TeamsState {
    allTeams: Team[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: TeamsState = {
    allTeams: [],
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
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTeams.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.allTeams = action.payload;
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
    },
});

export const { setPage } = teamsSlice.actions;
export default teamsSlice.reducer;