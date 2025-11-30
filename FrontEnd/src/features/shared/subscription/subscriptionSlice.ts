import { createSlice } from "@reduxjs/toolkit";
import { fetchAvailablePlans, updateUserPlan } from "./subscriptionThunks";
import type { AvailablePlan, UserSubscription } from "./subscriptionTypes";

interface SubscriptionState {
    availablePlans: AvailablePlan[];
    userSubscription: UserSubscription | null;

    loading: boolean;
    updating: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    availablePlans: [],
    userSubscription: null,

    loading: false,
    updating: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // FETCH
        builder.addCase(fetchAvailablePlans.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAvailablePlans.fulfilled, (state, action) => {
            state.loading = false;
            state.availablePlans = action.payload.plans;
            state.userSubscription = action.payload.userSubscription;
        });
        builder.addCase(fetchAvailablePlans.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // UPDATE PLAN
        builder.addCase(updateUserPlan.pending, (state) => {
            state.updating = true;
            state.error = null;
        });
        builder.addCase(updateUserPlan.fulfilled, (state, action) => {
            state.updating = false;
            state.userSubscription = action.payload;
        });
        builder.addCase(updateUserPlan.rejected, (state, action) => {
            state.updating = false;
            state.error = action.payload as string;
        });
    },
});

export default subscriptionSlice.reducer;
