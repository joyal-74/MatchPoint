import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchManagers = createAsyncThunk(
    "admin/fetchManagers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/admin/managers");
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch managers");
        }
    }
);

export const toggleManagerStatus = createAsyncThunk(
    "admin/toggleManagerStatus",
    async (managerId: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`/admin/managers/${managerId}/toggle`);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to update manager");
        }
    }
);
