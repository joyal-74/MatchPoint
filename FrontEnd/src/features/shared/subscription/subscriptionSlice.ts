import { createSlice } from "@reduxjs/toolkit";
import { fetchAvailablePlans, fetchUserPlan, finalizeSubscriptionPayment, initiateSubscriptionOrder } from "./subscriptionThunks";
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

        // INITIATE ORDER
        builder.addCase(initiateSubscriptionOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(initiateSubscriptionOrder.fulfilled, (state) => {
            state.loading = false;
        });

        builder.addCase(initiateSubscriptionOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // FINALIZE PAYMENT
        builder.addCase(finalizeSubscriptionPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(finalizeSubscriptionPayment.fulfilled, (state) => {
            state.loading = false;
        });

        builder.addCase(finalizeSubscriptionPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchUserPlan.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(fetchUserPlan.fulfilled, (state, action) => {
            state.userSubscription = action.payload;
            state.loading = false;
        });

        builder.addCase(fetchUserPlan.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
},);

export default subscriptionSlice.reducer;
