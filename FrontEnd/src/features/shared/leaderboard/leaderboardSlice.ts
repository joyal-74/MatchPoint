import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LeaderboardRow, PlayerRole, TimePeriod, TopPlayerStats } from "./leaderboardTypes";
import { fetchLeaderboardData } from "./leaderboardThunks";

interface LeaderboardState {
    topPlayers: TopPlayerStats[];
    leaderboard: LeaderboardRow[];
    selectedRole: PlayerRole | "All";
    timePeriod: TimePeriod;
    loading: boolean;
    error: string | null;
}

const initialState: LeaderboardState = {
    topPlayers: [],
    leaderboard: [],
    selectedRole: "Batter",
    timePeriod: "All Time",
    loading: false,
    error: null,
};



const leaderboardSlice = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<PlayerRole | "All">) => {
            state.selectedRole = action.payload;
        },
        setTimePeriod: (state, action: PayloadAction<TimePeriod>) => {
            state.timePeriod = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.topPlayers = action.payload.topPlayers;
                state.leaderboard = action.payload.leaderboard;
            })
            .addCase(fetchLeaderboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setRole, setTimePeriod } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
