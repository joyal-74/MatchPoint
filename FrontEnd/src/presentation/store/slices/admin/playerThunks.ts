import { createAsyncThunk } from "@reduxjs/toolkit";
import { playerEndpoints } from "../../../../infrastructure/api/endpoints/admin/PlayerEndPoints";
import type { Player } from "../../../../core/domain/entities/Player";

export const fetchPlayers = createAsyncThunk<Player[], void, { rejectValue: string }>(
    "admin/fetchPlayers",
    async (_, { rejectWithValue }) => {
        try {
            const players = await playerEndpoints.fetchPlayers();
            return players;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch players");
        }
    }
);

export const togglePlayerStatus = createAsyncThunk<Player, string, { rejectValue: string }>(
    "admin/togglePlayerStatus",
    async (playerId, { rejectWithValue }) => {
        try {
            const updatedPlayer = await playerEndpoints.togglePlayerStatus(playerId);
            return updatedPlayer;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to update player");
        }
    }
);
