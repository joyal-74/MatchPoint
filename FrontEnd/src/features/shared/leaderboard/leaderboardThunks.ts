import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { leaderboardEndpoints } from "../../../api/endpoints/leaderboardEndpoints";

export const fetchLeaderboardData = createAsyncThunk(
    "leaderboard/fetch",
    createApiThunk(leaderboardEndpoints.fetchLeaderboardData)
);