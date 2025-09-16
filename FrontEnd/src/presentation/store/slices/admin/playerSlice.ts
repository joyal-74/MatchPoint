import { createSlice } from "@reduxjs/toolkit";
import { fetchPlayers, togglePlayerStatus } from "./playerThunks";
import type { Player } from "../../../../core/domain/entities/Player";

interface PlayerState {
    list: Player[];
    loading: boolean;
    error: string | null;
}

const initialState: PlayerState = {
    list: [],
    loading: false,
    error: null,
};

const playerSlice = createSlice({
    name: "players",
    initialState,
    reducers: {},
    extraReducers: builder => {
        // Fetch players
        builder.addCase(fetchPlayers.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPlayers.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        });
        builder.addCase(fetchPlayers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ?? "Failed to fetch players";
        });

        // Toggle player status
        builder.addCase(togglePlayerStatus.fulfilled, (state, action) => {
            const updated = action.payload;
            const index = state.list.findIndex(p => p.id === updated.id);
            if (index !== -1) {
                state.list[index] = updated;
            }
        });
        builder.addCase(togglePlayerStatus.rejected, (state, action) => {
            state.error = action.payload ?? "Failed to update player";
        });
    },
});

export default playerSlice.reducer;
