import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { managerEndpoints } from "../../../api/endpoints/managerEndPoints";
import { walletEndpoints } from "../../../api/endpoints/walletEndPoints";

// --- Thunk ---

export const fetchFinancialReport = createAsyncThunk(
    "manager/fetchPayments",
    createApiThunk(managerEndpoints.fetchPayments)
);

export const saveNewAccountMethod = createAsyncThunk(
    "manager/saveNewAccountMethod",
    createApiThunk(walletEndpoints.saveNewAccountMethod)
);


export const fetchPayoutMethods = createAsyncThunk(
    "manager/fetchPayoutMethods",
    createApiThunk(walletEndpoints.fetchPayoutMethods)
);

export const deletePayoutMethod = createAsyncThunk(
    "manager/deletePayoutMethod",
    createApiThunk(walletEndpoints.deletePayoutMethod)
);

export const createRazorpayOrder = createAsyncThunk(
    "manager/createRazorpayOrder",
    createApiThunk(walletEndpoints.createRazorpayOrder)
);

export const verifyPayment = createAsyncThunk(
    "manager/verifyPayment",
    createApiThunk(walletEndpoints.verifyPayment)
);

export const initiateWithdrawal = createAsyncThunk(
    "manager/initiateWithdrawal",
    createApiThunk(walletEndpoints.initiateWithdrawal)
);