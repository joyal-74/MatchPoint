import { createSlice } from "@reduxjs/toolkit";
import {
    getMyTournaments,
    getExploreTournaments,
    createTournament,
    cancelTournament,
    editTournament,
    fetchTournament,
    paymentInitiate,
    verifyTournamentPayment,
    getRegisteredTeams,
    getTournamentFixtures,
    createTournamentFixtures,
    createTournamentMatches,
    getTournamentMatches,
    fetchLeaderboard,
    getDashboardAnalytics,
} from "./tournamentThunks";
import type { Fixture, Leaderboard, Match, Tournament } from "../managerTypes";
import type { RegisteredTeam } from "../../../components/manager/tournaments/TournamentDetails/tabs/TabContent";
import type { AnalyticsData } from "./tournamentTypes";

interface ManagerTournamentState {
    myTournaments: Tournament[];
    exploreTournaments: Tournament[];
    analyticsData: AnalyticsData | null;
    selectedTournament: Tournament | null;
    registeredTeams: RegisteredTeam[],
    fixtures: Fixture | null,
    matches: Match[] | null,
    leaderboard: Leaderboard,
    fixturesLoading: boolean,
    paymentStatus: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ManagerTournamentState = {
    myTournaments: [],
    exploreTournaments: [],
    analyticsData: null,
    selectedTournament: null,
    fixtures: null,
    matches: null,
    leaderboard: {
        tournamentId: "",
        topRuns: [],
        topWickets: [],
        mvp: []
    },
    fixturesLoading: false,
    registeredTeams: [],
    paymentStatus: false,
    loading: false,
    error: null,
};

const managerTournamentSlice = createSlice({
    name: "managerTournaments",
    initialState,
    reducers: {
        setSelectedTournament: (state, action) => {
            state.selectedTournament = action.payload;
        },

        clearSelectedTournament: (state) => {
            state.selectedTournament = null;
        },
    },
    extraReducers: (builder) => {
        // My Tournaments
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

        // Explore Tournaments
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

        // Create Tournament
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

        // Cancel Tournament
        builder
            .addCase(cancelTournament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelTournament.fulfilled, (state, action) => {
                console.log(action.payload)
                state.myTournaments = state.myTournaments.filter(
                    (t) => t._id !== action.payload
                );
                state.loading = false;
            })
            .addCase(cancelTournament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Edit Tournament
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

        builder
            .addCase(fetchTournament.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTournament.fulfilled, (state, action) => {
                console.log(action.payload)
                state.selectedTournament = action.payload;
                state.loading = false;
            })
            .addCase(fetchTournament.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // payment start
        builder
            .addCase(paymentInitiate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(paymentInitiate.fulfilled, (state, action) => {
                console.log(action.payload)

                state.selectedTournament = action.payload.tournament;
                state.loading = false;
            })
            .addCase(paymentInitiate.rejected, (state, action) => {
                console.log(action.payload)
                state.loading = false;
                state.error = action.payload as string;
            });

        // Payment verification
        builder
            .addCase(verifyTournamentPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyTournamentPayment.fulfilled, (state, action) => {
                state.paymentStatus = action.payload;
                state.loading = false;
            })
            .addCase(verifyTournamentPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Get registered teams
        builder
            .addCase(getRegisteredTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRegisteredTeams.fulfilled, (state, action) => {
                state.registeredTeams = action.payload;
                state.loading = false;
            })
            .addCase(getRegisteredTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // get tournament fixtures
        builder
            .addCase(getTournamentFixtures.pending, (state) => {
                state.fixturesLoading = true;
                state.error = null;
            })
            .addCase(getTournamentFixtures.fulfilled, (state, action) => {
                state.fixtures = action.payload;
                state.fixturesLoading = false;
            })
            .addCase(getTournamentFixtures.rejected, (state) => {
                state.fixturesLoading = false;
            });

        // get tournament matches
        builder
            .addCase(getTournamentMatches.pending, (state) => {
                state.fixturesLoading = true;
                state.error = null;
            })
            .addCase(getTournamentMatches.fulfilled, (state, action) => {
                state.matches = action.payload;
                state.fixturesLoading = false;
            })
            .addCase(getTournamentMatches.rejected, (state) => {
                state.fixturesLoading = false;
            });

        // create tournment fixtures
        builder
            .addCase(createTournamentFixtures.pending, (state) => {
                state.fixturesLoading = true;
                state.error = null;
            })
            .addCase(createTournamentFixtures.fulfilled, (state) => {
                state.fixturesLoading = false;
                state.error = null;

            })
            .addCase(createTournamentFixtures.rejected, (state, action) => {
                state.fixturesLoading = false;
                state.error = action.payload as string;
            });

        // create tournment matches
        builder
            .addCase(createTournamentMatches.pending, (state) => {
                state.fixturesLoading = true;
                state.error = null;
            })
            .addCase(createTournamentMatches.fulfilled, (state) => {
                state.fixturesLoading = false;
                state.error = null;

            })
            .addCase(createTournamentMatches.rejected, (state, action) => {
                state.fixturesLoading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.leaderboard = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getDashboardAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDashboardAnalytics.fulfilled, (state, action) => {
                state.analyticsData = action.payload;
            })
            .addCase(getDashboardAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { setSelectedTournament, clearSelectedTournament } = managerTournamentSlice.actions;
export default managerTournamentSlice.reducer;