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
}

interface UpdateLiveScorePayload {
    liveScore: LiveScoreState;
}

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
            state.liveScore = action.payload.liveScore;
        },
        setInitialInnings(state, action) {
            const { match } = action.payload;
            const { teamA, teamB, tossWinner, tossDecision } = match;

            let battingTeamId: string;
            let bowlingTeamId: string;

            if (tossDecision === "Batting") {
                battingTeamId = tossWinner;
                bowlingTeamId = tossWinner === teamA._id ? teamB._id : teamA._id;
            } else {
                bowlingTeamId = tossWinner;
                battingTeamId = tossWinner === teamA._id ? teamB._id : teamA._id;
            }

            if (state.liveScore?.innings1) {
                state.liveScore.innings1.battingTeamId = battingTeamId;
                state.liveScore.innings1.bowlingTeamId = bowlingTeamId;
            }
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
            })
            .addCase(loadMatchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
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
                state.loading = true;
            })
            .addCase(loadInitialLiveScore.fulfilled, (state, action) => {
                state.loading = false;
                state.liveScore = action.payload;
                state.error = undefined;
            })
            .addCase(loadInitialLiveScore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    }
});

export default matchSlice.reducer;
export const { updateLiveScore, setInitialInnings } = matchSlice.actions;