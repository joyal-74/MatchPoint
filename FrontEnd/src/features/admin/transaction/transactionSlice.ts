import { createSlice } from "@reduxjs/toolkit";
import type { TransactionState } from "./transactionTypes";
import { fetchTransactionDetails, fetchTransactions } from "./transactionThunks";


const initialState: TransactionState = {
    transactions: [],
    selectedTransaction: null,
    loading: false,
    totalCount: 0,
    stats: {
        totalRevenue: 0,
        totalVolume: 0,
        pendingPayouts: 0
    },
    error: null,
};

// --- Slice ---

const transactionSlice = createSlice({
    name: "adminTransactions",
    initialState,
    reducers: {
        clearTransactionState: (state) => {
            state.transactions = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.data;
                state.totalCount = action.payload.total;

                if (action.payload.stats) {
                    state.stats = action.payload.stats;
                }
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchTransactionDetails.pending, (state) => {
                state.loading = true;
                state.selectedTransaction = null;
            })
            .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTransaction = action.payload;
            })
            .addCase(fetchTransactionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;