import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { walletEndpoints } from "../../../api/endpoints/walletEndPoints";
import { managerEndpoints } from "../../../api/endpoints/managerEndPoints";


export const fetchUserPayments = createAsyncThunk(
    "shared/fetchUserPayments",
    createApiThunk(walletEndpoints.fetchUserPayments)
);



export const fetchFinancialReport = createAsyncThunk(
    "manager/fetchPayments",
    createApiThunk(managerEndpoints.fetchPayments)
);

export const saveNewAccountMethod = createAsyncThunk(
    "shared/saveNewAccountMethod",
    createApiThunk(walletEndpoints.saveNewAccountMethod)
);


export const fetchPayoutMethods = createAsyncThunk(
    "shared/fetchPayoutMethods",
    createApiThunk(walletEndpoints.fetchPayoutMethods)
);

export const deletePayoutMethod = createAsyncThunk(
    "shared/deletePayoutMethod",
    createApiThunk(walletEndpoints.deletePayoutMethod)
);

export const createRazorpayOrder = createAsyncThunk(
    "shared/createRazorpayOrder",
    createApiThunk(walletEndpoints.createRazorpayOrder)
);

export const verifyPayment = createAsyncThunk(
    "shared/verifyPayment",
    createApiThunk(walletEndpoints.verifyPayment)
);

export const initiateWithdrawal = createAsyncThunk(
    "shared/initiateWithdrawal",
    createApiThunk(walletEndpoints.initiateWithdrawal)
);