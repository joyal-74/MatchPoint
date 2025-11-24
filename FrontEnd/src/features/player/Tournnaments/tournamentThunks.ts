import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { playerEndpoints } from "../../../api/endpoints/playerEndpoints";

export const fetchTournaments = createAsyncThunk(
    "player/fetchTournaments",
    createApiThunk(playerEndpoints.fetchTournaments)
);