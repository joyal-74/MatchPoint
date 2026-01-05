import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { adminEndpoints } from "../../../api/endpoints/adminEndpoints";
import type { Transaction, TransactionStats } from "./transactionTypes";

export const fetchTransactions = createAsyncThunk<{ data: Transaction[], total: number, stats?: TransactionStats }, { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/transactions",
    createApiThunk(({ page, limit, filter, search }) => adminEndpoints.fetchTransactions(page, limit, filter, search))
);


export const fetchTransactionDetails = createAsyncThunk<Transaction, string>(
    "/admin/transactions/details",
    createApiThunk((id ) => adminEndpoints.fetchTransactionDetails(id))
);