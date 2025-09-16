import { createSlice } from "@reduxjs/toolkit";
import { fetchManagers, toggleManagerStatus } from './managerThunks';

interface Manager {
    _id: string;
    name: string;
    email: string;
    status: "active" | "blocked";
    createdAt : Date,
}

interface ManagerState {
    list: Manager[];
    loading: boolean;
    error: string | null;
}

const initialState: ManagerState = {
    list: [],
    loading: false,
    error: null,
};

const managerSlice = createSlice({
    name: "managers",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchManagers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleManagerStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex(m => m._id === updated._id);
                if (index !== -1) state.list[index] = updated;
            });
    },
});

export default managerSlice.reducer;