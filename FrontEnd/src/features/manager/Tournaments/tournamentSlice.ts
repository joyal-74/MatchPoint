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
} from "./tournamentThunks";
import type { Tournament } from "../managerTypes";
import type { RegisteredTeam } from "../../../components/manager/tournaments/TournamentDetails/tabs/TabContent";

interface ManagerTournamentState {
    myTournaments: Tournament[];
    exploreTournaments: Tournament[];
    selectedTournament: Tournament | null;
    registeredTeams : RegisteredTeam[],
    paymentStatus : boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ManagerTournamentState = {
    myTournaments: [],
    exploreTournaments: [],
    selectedTournament: null,
    registeredTeams :[],
    paymentStatus : false,
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
    },
});


export const { setSelectedTournament, clearSelectedTournament } = managerTournamentSlice.actions;
export default managerTournamentSlice.reducer;
