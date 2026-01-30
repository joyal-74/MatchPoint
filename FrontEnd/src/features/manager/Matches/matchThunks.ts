import { createAsyncThunk } from "@reduxjs/toolkit";
import { matchEndpoints } from "../../../api/endpoints/matchEndpoints";
import { createApiThunk } from "../../../utils/createApiThunk";

export const loadMatchDashboard = createAsyncThunk(
    "manager/loadMatchDashboard",
    createApiThunk(matchEndpoints.getMatchById)
);

export const saveMatchData = createAsyncThunk(
    "manager/saveMatchData",
    createApiThunk(matchEndpoints.saveMatchData)
);

export const startMatch = createAsyncThunk(
    "manager/startMatch",
    createApiThunk(matchEndpoints.startMatch)
);

export const loadInitialLiveScore = createAsyncThunk(
    "manager/loadInitialLiveScore",
    createApiThunk(matchEndpoints.loadInitialLiveScore)
);

export const fetchMatchesByManager = createAsyncThunk(
    "manager/fetchMatchesByManager",
    createApiThunk(matchEndpoints.fetchMatchesByManager)
);

export const fetchAllMatches = createAsyncThunk(
    "manager/fetchAllMatches",
    createApiThunk(matchEndpoints.fetchAllMatches)
);
