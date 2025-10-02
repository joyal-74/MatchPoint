import { createSlice } from "@reduxjs/toolkit";
import {
    getMyTournaments,
    getExploreTournaments,
    createTournament,
    deleteTournament,
    editTournament,
} from "./tournamentThunks";
import type { Tournament } from "../managerTypes";

interface ManagerTournamentState {
    myTournaments: Tournament[];
    exploreTournaments: Tournament[];
    loading: boolean;
    error: string | null;
}

const initialState: ManagerTournamentState = {
    myTournaments: [],
    exploreTournaments: [],
    loading: false,
    error: null,
};

const managerTournamentSlice = createSlice({
    name: "managerTournaments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ---------------- My Tournaments ----------------
        builder
            .addCase(getMyTournaments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyTournaments.fulfilled, (state, action) => {
                state.myTournaments = action.payload;
                state.loading = false;
            })
            .addCase(getMyTournaments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ---------------- Explore Tournaments ----------------
        builder
            .addCase(getExploreTournaments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExploreTournaments.fulfilled, (state, action) => {
                state.exploreTournaments = action.payload;
                state.loading = false;
            })
            .addCase(getExploreTournaments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ---------------- Create Tournament ----------------
        builder
            .addCase(createTournament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTournament.fulfilled, (state, action) => {
                state.myTournaments.push(action.payload);
                state.loading = false;
            })
            .addCase(createTournament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ---------------- Delete Tournament ----------------
        builder
            .addCase(deleteTournament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTournament.fulfilled, (state, action) => {
                state.myTournaments = state.myTournaments.filter(
                    (t) => t._id !== action.payload._id
                );
                state.loading = false;
            })
            .addCase(deleteTournament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // ---------------- Edit Tournament ----------------
        builder
            .addCase(editTournament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editTournament.fulfilled, (state, action) => {
                const updated = action.payload;
                state.myTournaments = state.myTournaments.map((t) =>
                    t._id === updated._id ? updated : t
                );
                state.loading = false;
            })
            .addCase(editTournament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default managerTournamentSlice.reducer;
