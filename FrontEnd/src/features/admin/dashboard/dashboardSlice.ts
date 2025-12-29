import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { adminEndpoints } from "../../../api/endpoints/adminEndpoints";

// --- Types ---
interface DashboardData {
    counts: { revenue: number; players: number; tournaments: number; teams: number };
    revenueData: { name: string; revenue: number }[];
    registrationData: { date: string; count: number }[];
    userDistribution: { name: string; value: number }[];
    recentTournaments: any[];
}

interface DashboardState {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    loading: false,
    error: null,
};

// --- Thunk ---
export const fetchDashboardStats = createAsyncThunk<DashboardData>(
    "admin/dashboard/fetchStats",
    createApiThunk(() => adminEndpoints.getDashboardStats())
);

// --- Slice ---
const dashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load stats";
            });
    },
});

export default dashboardSlice.reducer;