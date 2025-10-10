import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/createApiThunk";
import { playerEndpoints } from "../../api/endpoints/playerEndpoints";
import { setUser } from "../auth";
import type { UpdateUserDataPayload } from "../manager/managerTypes";

// Fetch all teams
export const getMyTeams = createAsyncThunk(
    "player/getMyTeams",
    createApiThunk(playerEndpoints.getMyTeams)
);


export const getMyTeamDetails = createAsyncThunk(
    "player/getMyTeamDetails",
    createApiThunk(playerEndpoints.getMyTeamDetails)
);


export const fetchPlayerData = createAsyncThunk(
    "player/fetchPlayerData",
    createApiThunk(playerEndpoints.fetchPlayerData)
);


export const updatePlayerData = createAsyncThunk(
    "player/updatePlayerData",
    createApiThunk(async (data: UpdateUserDataPayload, dispatch) => {
        const response = await playerEndpoints.updatePlayerData(data);
        dispatch(setUser(response));
        return response;
    })
);