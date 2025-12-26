import { createSlice } from "@reduxjs/toolkit";
import { fetchFinancialReport } from "./financialThunk";

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
    loading: boolean;
}

const initialState: FinancialState = {
    balance: 0,
    transactions: [],
    tournaments: [],
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
            });
    }
});

export default financialSlice.reducer;