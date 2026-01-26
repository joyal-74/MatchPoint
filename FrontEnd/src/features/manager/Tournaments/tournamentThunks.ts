import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { managerEndpoints } from "../../../api/endpoints/managerEndPoints";


export const getMyTournaments = createAsyncThunk(
    "manager/getMyTournaments",
    createApiThunk(managerEndpoints.getMyTournaments)
);

export const getExploreTournaments = createAsyncThunk(
    "manager/getExploreTournaments",
    createApiThunk(managerEndpoints.getExploreTournaments)
);

export const getDashboardAnalytics = createAsyncThunk(
    "manager/getDashboardAnalytics",
    createApiThunk(managerEndpoints.getDashboardAnalytics)
);

export const createTournament = createAsyncThunk(
    "manager/createTournament",
    createApiThunk(managerEndpoints.createTournament)
);

export const cancelTournament = createAsyncThunk(
    "manager/cancelTournament",
    createApiThunk(managerEndpoints.cancelTournament)
);

export const editTournament = createAsyncThunk(
    "manager/editTournament",
    createApiThunk(managerEndpoints.editTournament)
);

export const fetchTournament = createAsyncThunk(
    "manager/fetchTournament",
    createApiThunk(managerEndpoints.fetchTournamentDetails)
)

export const paymentInitiate = createAsyncThunk(
    "manager/paymentInitiate",
    createApiThunk(managerEndpoints.paymentInitiate)
)

export const verifyTournamentPayment = createAsyncThunk(
    "manager/verifyTournamentPayment",
    createApiThunk(managerEndpoints.verifyTournamentPayment)
)

export const getRegisteredTeams = createAsyncThunk(
    "manager/getRegisteredTeams",
    createApiThunk(managerEndpoints.getRegisteredTeams)
)

export const createTournamentFixtures  = createAsyncThunk(
    "manager/createTournamentFixtures",
    createApiThunk(managerEndpoints.createTournamentFixtures )
)

export const createTournamentMatches  = createAsyncThunk(
    "manager/createTournamentMatches",
    createApiThunk(managerEndpoints.createTournamentMatches )
)

export const getTournamentFixtures  = createAsyncThunk(
    "manager/getTournamentFixtures",
    createApiThunk(managerEndpoints.getTournamentFixtures )
)

export const getTournamentMatches  = createAsyncThunk(
    "manager/getTournamentMatches",
    createApiThunk(managerEndpoints.getTournamentMatches )
)

export const getTournamentMatchesResult  = createAsyncThunk(
    "manager/getTournamentMatchesResult",
    createApiThunk(managerEndpoints.getTournamentMatchesResult )
)

export const fetchLeaderboard  = createAsyncThunk(
    "manager/fetchLeaderboard",
    createApiThunk(managerEndpoints.fetchLeaderboard )
)

export const startTournament  = createAsyncThunk(
    "manager/startTournament",
    createApiThunk(managerEndpoints.startTournament )
)

export const fetchTournamentPointsTable  = createAsyncThunk(
    "manager/fetchTournamentPointsTable",
    createApiThunk(managerEndpoints.fetchTournamentPointsTable )
)