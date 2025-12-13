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
    battingTeam: '',
    bowlingTeam: '',
    runs: 0,
    wickets: 0,
    overLimit: 0,
    legalBalls : 0,
    deliveries : 0,
    currentStriker: null,
    currentNonStriker: null,
    currentBowler: null,
    isCompleted: false,
    currentRunRate : '',
    ballEvents: [],
    recentLogs: [],
    battingStats: [],
    bowlingStats: [],
    extras : {
        wides : 0,
        byes : 0,
        legByes : 0,
        noBalls : 0,
        penalty : 0,
        total : 0
    }
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
                state.liveScore.innings1.battingTeam = battingTeamId;
                state.liveScore.innings1.bowlingTeam = bowlingTeamId;
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