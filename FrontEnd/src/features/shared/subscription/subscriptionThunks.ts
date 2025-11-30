import { createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionEndpoints } from "../../../api/endpoints/subscriptionEndpoints";
import { createApiThunk } from "../../../utils/createApiThunk";


export const fetchAvailablePlans = createAsyncThunk(
    "subscription/fetchAvailablePlans",
    createApiThunk(subscriptionEndpoints.fetchAvailablePlans)
);

export const updateUserPlan = createAsyncThunk(
    "subscription/updateUserPlan",
    createApiThunk(subscriptionEndpoints.updateUserPlan)
);
