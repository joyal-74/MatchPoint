import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";

import type { ThunkApiConfig } from "../../types/redux";
import type { ApiError } from "../../types/auth";

interface User {
    id: string;
    name: string;
    email: string;
    token?: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: ApiError | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};


export const loginUser = createAsyncThunk<
    User,
    ThunkApiConfig,
    { rejectValue: ApiError }
>("user/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post<User>("/login", credentials);
        return response.data;
    } catch (error) {
        const err = error as AxiosError<ApiError>;
        return rejectWithValue(err.response?.data || "Something went wrong");
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;