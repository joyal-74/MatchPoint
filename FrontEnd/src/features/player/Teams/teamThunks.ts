import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk"; 
import { playerEndpoints } from "../../../api/endpoints/playerEndpoints"; 


export const fetchTeams = createAsyncThunk(
    "player/getAllTeams",
    createApiThunk(playerEndpoints.getAllTeams)
);

export const joinTeam = createAsyncThunk(
    "player/joinTeam",
    createApiThunk(playerEndpoints.joinTeam)
);