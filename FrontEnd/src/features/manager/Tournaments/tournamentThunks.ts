import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { managerEndpoints } from "../../../api/endpoints/managerEndPoints";


export const getMyTournaments = createAsyncThunk(
    "manager/getMyTournaments",
    createApiThunk(managerEndpoints.getMyTournaments)
);

export const getExploreTournaments = createAsyncThunk(
    "manager/getExploreTournaments",
    createApiThunk(managerEndpoints.getExploreTournaments)
);

export const createTournament = createAsyncThunk(
    "manager/createTournament",
    createApiThunk(managerEndpoints.createTournament)
);

export const cancelTournament = createAsyncThunk(
    "manager/cancelTournament",
    createApiThunk(managerEndpoints.cancelTournament)
);

export const editTournament = createAsyncThunk(
    "manager/editTournament",
    createApiThunk(managerEndpoints.editTournament)
);