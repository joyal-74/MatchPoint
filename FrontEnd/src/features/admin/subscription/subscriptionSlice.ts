import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Plan } from "./subscriptionTypes";
import { fetchPlans, addPlan, deletePlan } from "./subscriptionThunks";

interface SubscriptionState {
    plans: Plan[];
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    plans: [],
    loading: false,
    error: null
};

export const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {},
    extraReducers: builder => {

        // FETCH
        builder.addCase(fetchPlans.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
            state.loading = false;
            state.plans = action.payload;
        });
        builder.addCase(fetchPlans.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to load plans";
        });

        // ADD
        builder.addCase(addPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
            state.plans.push(action.payload);
        });

        // DELETE
        builder.addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
            state.plans = state.plans.filter(p => p._id !== action.payload);
        });
    }
});

export default subscriptionSlice.reducer;
