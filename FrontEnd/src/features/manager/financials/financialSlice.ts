import { createSlice } from "@reduxjs/toolkit";
import { createRazorpayOrder, deletePayoutMethod, fetchFinancialReport, fetchPayoutMethods, saveNewAccountMethod, verifyPayment } from "./financialThunk";
import type { PayoutMethod } from "./financialTypes";

// --- Types ---
export interface Transaction {
    id: string;
    date: string;
    description: string;
    tournament: string;
    type: 'income' | 'expense' | 'refund';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    method: string;
}

export interface TournamentFinancials {
    id: string;
    name: string;
    plan: 'Basic' | 'Pro' | 'Elite';
    entryFee: number;
    minTeams: number;
    currentTeams: number;
    status: 'Upcoming' | 'Live' | 'Completed';
}

interface FinancialState {
    balance: number;
    transactions: Transaction[];
    tournaments: TournamentFinancials[];
    payoutMethods: PayoutMethod[];
    loading: boolean;
}

const initialState: FinancialState = {
    balance: 0,
    transactions: [],
    tournaments: [],
    payoutMethods: [],
    loading: false
};

const financialSlice = createSlice({
    name: "financials",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinancialReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFinancialReport.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.balance;
                state.transactions = action.payload.transactions;
                state.tournaments = action.payload.tournaments;
            })
            .addCase(fetchFinancialReport.rejected, (state) => {
                state.loading = false;
            })

            .addCase(saveNewAccountMethod.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveNewAccountMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.payoutMethods.push(action.payload);
            })
            .addCase(saveNewAccountMethod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(fetchPayoutMethods.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPayoutMethods.fulfilled, (state, action) => {
                state.loading = false;
                state.payoutMethods = action.payload;
            })
            .addCase(fetchPayoutMethods.rejected, (state) => {
                state.loading = false;
            })

            .addCase(deletePayoutMethod.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePayoutMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.payoutMethods = action.payload;
            })
            .addCase(deletePayoutMethod.rejected, (state) => {
                state.loading = false;
            })

            .addCase(createRazorpayOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createRazorpayOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createRazorpayOrder.rejected, (state) => {
                state.loading = false;
            })

            // --- Verify Payment ---
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload.balance;
            })
            .addCase(verifyPayment.rejected, (state) => {
                state.loading = false;
            });
    }
});

export default financialSlice.reducer;