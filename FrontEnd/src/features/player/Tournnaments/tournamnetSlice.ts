import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Tournament } from "../../manager/managerTypes";
import { fetchTournaments } from "./tournamentThunks";


interface TournamentState {
    allTournaments: Tournament[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
}

const initialState: TournamentState = {
    allTournaments: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
};


const tournamentSlice = createSlice({
    name: "tournamnets",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTournaments.pending, state => {
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
                state.error = action.error.message || "Failed to fetch tournaments";
            });
    },
});

export const { setPage } = tournamentSlice.actions;
export default tournamentSlice.reducer;