import { createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionEndpoints } from "../../../api/endpoints/subscriptionEndpoints";
import { createApiThunk } from "../../../utils/createApiThunk";


export const fetchAvailablePlans = createAsyncThunk(
    "subscription/fetchAvailablePlans",
    createApiThunk(subscriptionEndpoints.fetchAvailablePlans)
);

export const updatePlanDirectly = createAsyncThunk(
    "subscription/updatePlanDirectly",
    createApiThunk(subscriptionEndpoints.updatePlanDirectly)
);

export const initiateSubscriptionOrder = createAsyncThunk(
    "subscription/initiateSubscriptionOrder",
    createApiThunk(subscriptionEndpoints.initiateOrder)
);

export const finalizeSubscriptionPayment = createAsyncThunk(
    "subscription/finalizeSubscriptionPayment",
    createApiThunk(subscriptionEndpoints.finalizePayment)
);

export const fetchUserPlan = createAsyncThunk(
    "subscription/fetchUserPlan",
    createApiThunk(subscriptionEndpoints.fetchUserPlan)
);