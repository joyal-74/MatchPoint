import { createSlice } from "@reduxjs/toolkit";
import { fetchUmpireData, updateUmpireData } from "./umpireThunks";
import type { User } from "../../types/User";

interface UmpireState {
    umpire: User | null;
    loading: boolean;
    fetched: boolean,
    error: string | null;
}

const initialState: UmpireState = {
    umpire: null,
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
            });
    },
});



export default umpireSlice.reducer;