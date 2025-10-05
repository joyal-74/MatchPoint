import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk"; 
import { playerEndpoints } from "../../../api/endpoints/playerEndpoints"; 


export const fetchTeams = createAsyncThunk(
    "manager/getAllTeams",
    createApiThunk(playerEndpoints.getAllTeams)
);

export const joinTeam = createAsyncThunk(
    "manager/joinTeam",
    createApiThunk(playerEndpoints.joinTeam)
);