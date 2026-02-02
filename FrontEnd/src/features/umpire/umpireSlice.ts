import { createSlice } from "@reduxjs/toolkit";
import { fetchAllMatches, fetchUmpireData, updateUmpireData } from "./umpireThunks";
import type { User } from "../../types/User";
import type { Match } from "./umpireTypes";

interface UmpireState {
    umpire: User | null;
    allMatches: Match[];
    totalPages: number | null;
    loading: boolean;
    fetched: boolean,
    error: string | null;
}

const initialState: UmpireState = {
    umpire: null,
    allMatches: [],
    totalPages : null,
    loading: false,
    fetched: false,
    error: null,
};

const umpireSlice = createSlice({
    name: "umpire",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUmpireData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUmpireData.fulfilled, (state, action) => {
                state.umpire = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUmpireData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Fetch umpire details failed";
            });

        builder
            .addCase(updateUmpireData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUmpireData.fulfilled, (state, action) => {
                state.umpire = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUmpireData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Edit failed";
            })

            .addCase(fetchAllMatches.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllMatches.fulfilled, (state, action) => {
                state.loading = false;
                state.allMatches = action.payload.matches;
                state.totalPages = action.payload.totalPages;
                state.error = null;
            })
            .addCase(fetchAllMatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});



export default umpireSlice.reducer;