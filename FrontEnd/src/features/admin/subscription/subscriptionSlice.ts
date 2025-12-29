import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Plan } from "./subscriptionTypes";
import { fetchPlans, addPlan, deletePlan, updatePlan } from "./subscriptionThunks";

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

        // ================= FETCH PLANS =================
        builder.addCase(fetchPlans.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
            state.loading = false;
            state.plans = action.payload;
        });
        builder.addCase(fetchPlans.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to load plans";
        });

        // ================= ADD PLAN =================
        builder.addCase(addPlan.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
            state.loading = false;
            state.plans.push(action.payload);
        });
        builder.addCase(addPlan.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to add plan";
        });

        // ================= UPDATE PLAN =================
        builder.addCase(updatePlan.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updatePlan.fulfilled, (state, action: PayloadAction<Plan>) => {
            state.loading = false;
            // Find the index of the plan and update it
            const index = state.plans.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.plans[index] = action.payload;
            }
        });
        builder.addCase(updatePlan.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to update plan";
        });

        // ================= DELETE PLAN =================
        builder.addCase(deletePlan.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.plans = state.plans.filter(p => p._id !== action.payload);
        });
        builder.addCase(deletePlan.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to delete plan";
        });
    }
});

export default subscriptionSlice.reducer;