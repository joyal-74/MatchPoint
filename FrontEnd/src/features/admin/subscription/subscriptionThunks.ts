import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { subscriptionEndpoints } from "../../../api/endpoints/subscriptionEndpoints";

// GET plans
export const fetchPlans = createAsyncThunk(
    "subscription/fetchPlans",
    createApiThunk(subscriptionEndpoints.fetchPlans)
);

// ADD new plan
export const addPlan = createAsyncThunk(
    "subscription/addPlan",
    createApiThunk(subscriptionEndpoints.addPlan)
);

// DELETE plan by id
export const deletePlan = createAsyncThunk(
    "subscription/deletePlan",
    createApiThunk(subscriptionEndpoints.deletePlan)
);
