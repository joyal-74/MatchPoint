import { createAsyncThunk } from "@reduxjs/toolkit";
import { managerEndpoints } from "../../api/endpoints/managerEndPoints";
import { createApiThunk } from "../../utils/createApiThunk";


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
    createApiThunk(managerEndpoints.updateManagerData)
);
