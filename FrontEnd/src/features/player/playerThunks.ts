import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/createApiThunk";
import { playerEndpoints } from "../../api/endpoints/playerEndpoints";

// Fetch all teams
export const getMyTeams = createAsyncThunk(
    "manager/getMyTeams",
    createApiThunk(playerEndpoints.getMyTeams)
);


export const getMyTeamDetails = createAsyncThunk(
    "manager/getMyTeamDetails",
    createApiThunk(playerEndpoints.getMyTeamDetails)
);


export const fetchPlayerData = createAsyncThunk(
    "manager/fetchPlayerData",
    createApiThunk(playerEndpoints.fetchPlayerData)
);


export const updatePlayerData = createAsyncThunk(
    "manager/getMyTeamDetails",
    createApiThunk(playerEndpoints.updatePlayerData)
);