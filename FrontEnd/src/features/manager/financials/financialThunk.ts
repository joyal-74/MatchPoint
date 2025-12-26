import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { managerEndpoints } from "../../../api/endpoints/managerEndPoints";

// --- Thunk ---

export const fetchFinancialReport = createAsyncThunk(
    "manager/fetchPayments",
    createApiThunk(managerEndpoints.fetchPayments)
);