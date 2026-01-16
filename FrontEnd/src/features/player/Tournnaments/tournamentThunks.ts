import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { playerEndpoints } from "../../../api/endpoints/playerEndpoints";

export const fetchTournaments = createAsyncThunk(
    "player/fetchTournaments",
    createApiThunk(playerEndpoints.fetchTournaments)
);

export const tournamentDetails = createAsyncThunk(
    "player/tournamentDetails",
    createApiThunk(playerEndpoints.tournamentDetails)
);

export const fetchLiveMatches  = createAsyncThunk(
    "player/fetchLiveMatches ",
    createApiThunk(playerEndpoints.fetchLiveMatches)
);

// tournament details page
export const fetchTournamentMatches  = createAsyncThunk(
    "player/fetchTournamentMatches ",
    createApiThunk(playerEndpoints.fetchTournamentMatches)
);

export const fetchTournamentPointsTable  = createAsyncThunk(
    "player/fetchTournamentPointsTable ",
    createApiThunk(playerEndpoints.fetchTournamentPointsTable)
);

export const fetchTournamentStats  = createAsyncThunk(
    "player/fetchTournamentStats ",
    createApiThunk(playerEndpoints.fetchTournamentStats)
);