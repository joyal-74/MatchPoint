import { createAsyncThunk } from "@reduxjs/toolkit";
import { managerEndpoints } from "../../api/endpoints/managerEndPoints";
import { createApiThunk } from "../../utils/createApiThunk";
import { setUser } from "../auth";
import type { UpdateUserDataPayload } from "./managerTypes";


// Fetch all teams
export const getAllTeams = createAsyncThunk(
    "manager/getAllTeams",
    createApiThunk(managerEndpoints.getAllTeams)
);

// Create a new team
export const createTeam = createAsyncThunk(
    "manager/createTeam",
    createApiThunk(managerEndpoints.createTeam)
);

// Delete a team
export const deleteTeam = createAsyncThunk(
    "manager/deleteTeam",
    createApiThunk(managerEndpoints.deleteTeam)
);

// Delete a team
export const editTeam = createAsyncThunk(
    "manager/editTeam",
    createApiThunk(managerEndpoints.editTeam)
);

export const fetchManagerData = createAsyncThunk(
    "manager/fetchManagerData",
    createApiThunk(managerEndpoints.fetchManagerData)
);

export const updateManagerData = createAsyncThunk(
    "manager/updateManagerData",
    createApiThunk(async (data : UpdateUserDataPayload, dispatch) => {
        const response = await managerEndpoints.updateManagerData(data);
        dispatch(setUser(response));
        return response;
    })
);


export const getMyTeamDetails = createAsyncThunk(
    "manager/getMyTeamDetails",
    createApiThunk(managerEndpoints.getMyTeamDetails)
);

export const approvePlayerRequest = createAsyncThunk(
    "manager/approvePlayerRequest",
    createApiThunk(managerEndpoints.approvePlayerRequest)
);

export const rejectPlayerRequest = createAsyncThunk(
    "manager/approvePlayerRequest",
    createApiThunk(managerEndpoints.rejectPlayerRequest)
);

export const removePlayerFromTeam = createAsyncThunk(
    "manager/removePlayerFromTeam",
    createApiThunk(managerEndpoints.removePlayerFromTeam)
);

export const updatePlayerStatus  = createAsyncThunk(
    "manager/updatePlayerStatus",
    createApiThunk(managerEndpoints.updatePlayerStatus)
);


export const getAvailablePlayers  = createAsyncThunk(
    "manager/updatePlayerStatus",
    createApiThunk(managerEndpoints.getAvailablePlayers)
);

export const addPlayerToTeam   = createAsyncThunk(
    "manager/updatePlayerStatus",
    createApiThunk(managerEndpoints.addPlayerToTeam )
);

export const startTournament   = createAsyncThunk(
    "manager/startTournament",
    createApiThunk(managerEndpoints.startTournament )
);

export const cancelTournament   = createAsyncThunk(
    "manager/cancelTournament",
    createApiThunk(managerEndpoints.cancelTournament )
);