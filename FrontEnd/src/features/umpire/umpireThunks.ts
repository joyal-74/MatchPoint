import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UpdateUserDataPayload } from "../manager/managerTypes";
import { createApiThunk } from "../../utils/createApiThunk";
import { setUser } from "../auth";
import { umpireEndpoints } from "../../api/endpoints/umpireEndpoints";

export const fetchUmpireData = createAsyncThunk(
    "umpire/fetchUmpireData",
    createApiThunk(umpireEndpoints.fetchUmpireData)
);

export const updateUmpireData = createAsyncThunk(
    "umpire/updateUmpireData",
    createApiThunk(async (data : UpdateUserDataPayload, dispatch) => {
        const response = await umpireEndpoints.updateUmpireData(data);
        dispatch(setUser(response));
        return response;
    })
);

export const fetchAllMatches = createAsyncThunk(
    "umpire/fetchAllMatches",
    createApiThunk(umpireEndpoints.fetchAllMatches)
);