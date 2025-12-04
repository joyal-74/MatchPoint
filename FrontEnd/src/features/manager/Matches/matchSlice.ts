import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadInitialLiveScore, loadMatchDashboard, saveMatchData } from "./matchThunks";
import type { Team, Match } from "./matchTypes";

import type { LiveScoreState, InningsState } from "./matchTypes";

interface MatchState {
    match: Match | null;
    teamA: Team | null;
    teamB: Team | null;
    loading: boolean;
    error: string | undefined;
    liveScore: LiveScoreState | null;
};

// Define the action payload type
interface UpdateLiveScorePayload {
    liveScore: LiveScoreState;
}

// --- Helper for Initial Innings State ---
const initialInningsState: InningsState = {
    battingTeamId: '',
    bowlingTeamId: '',
    score: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0,
    currentBatsmanId: null,
    nonStrikerId: null,
    currentBowlerId: null,
    isCompleted: false,
    ballEvents: [],
    battingStats: {},
    bowlingStats: {},
};

// --- 2. Correct Initial State ---
const initialState: MatchState = {
    match: null,
    teamA: null,
    teamB: null,
    loading: false,
    error: undefined,
    liveScore: {
        innings1: initialInningsState,
        innings2: null,
        currentInnings: 1,
        requiredRuns: 0,
        target: 0,
        currentRunRate: 0,
        requiredRunRate: 0
    }
};

const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {
        updateLiveScore: (state, action: PayloadAction<UpdateLiveScorePayload>) => {
            console.log("🔄 Updating live score in Redux:", action.payload.liveScore);
            state.liveScore = action.payload.liveScore;

            // Also update nested currentInnings references if needed
            if (state.liveScore?.currentInnings === 1) {
                console.log("Updated striker:", state.liveScore.innings1.currentBatsmanId);
                console.log("Updated bowler:", state.liveScore.innings1.currentBowlerId);
            }
        },
        setInitialInnings(state, action) {
            const { match } = action.payload;
            const { teamA, teamB, tossWinner, tossDecision } = match;

            let battingTeamId: string;
            let bowlingTeamId: string;

            // Your decision uses "Batting" not "bat"
            if (tossDecision === "Batting") {
                battingTeamId = tossWinner;
                bowlingTeamId = tossWinner === teamA._id ? teamB._id : teamA._id;
            } else {
                bowlingTeamId = tossWinner;
                battingTeamId = tossWinner === teamA._id ? teamB._id : teamA._id;
            }

            // update innings1 safely
            if (state.liveScore?.innings1) {
                state.liveScore.innings1.battingTeamId = battingTeamId;
                state.liveScore.innings1.bowlingTeamId = bowlingTeamId;
            }
        },
        updateMatchFromSocket(state, action: PayloadAction<any>) {
            // Merge/overwrite match metadata from backend
            const updatedMatch = action.payload;
            state.match = { ...(state.match || {}), ...updatedMatch };
            // If liveScore nested inside payload, update it as well
            if (updatedMatch.liveScore) {
                state.liveScore = updatedMatch.liveScore;
            }
            // Also update teamA/teamB if included
            if (updatedMatch.teamA) state.teamA = updatedMatch.teamA;
            if (updatedMatch.teamB) state.teamB = updatedMatch.teamB;
        },


    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMatchDashboard.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(loadMatchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.match = action.payload.match;
                state.teamA = action.payload.teamA;
                state.teamB = action.payload.teamB;

                // You must also initialize the LiveScoreState based on the loaded match data
                // This logic will depend on whether the match is upcoming, live, or completed.
                // For a 'live' match, you'd load the current live score from the API payload too.
            })
            .addCase(loadMatchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            //
            .addCase(saveMatchData.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveMatchData.fulfilled, (state, action) => {
                state.loading = false;
                state.match = action.payload;
            })
            .addCase(saveMatchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(loadInitialLiveScore.pending, (state) => {
                state.loading = true;  // Reuse existing loading flag, or add a separate one
            })
            .addCase(loadInitialLiveScore.fulfilled, (state, action) => {
                state.loading = false;
                state.liveScore = action.payload;  // Directly set the full LiveScoreState
                state.error = undefined;
            })
            .addCase(loadInitialLiveScore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;  // Cast to string for your error type
            })
    }
});

export default matchSlice.reducer;
export const { updateLiveScore, setInitialInnings, updateMatchFromSocket } = matchSlice.actions;