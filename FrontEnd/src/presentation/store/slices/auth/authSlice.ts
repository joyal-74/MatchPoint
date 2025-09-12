import { createSlice } from "@reduxjs/toolkit";
import { loginUser, resendOtp, signupUser, verifyOtp } from "../auth/authThunks";
import type { User } from "../../../../core/domain/entities/User";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null
    signupSuccess: boolean
    otpVerified: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    signupSuccess: false,
    otpVerified: false,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.error = null;
            state.signupSuccess = false;
            state.otpVerified = false;
        },
    },
    extraReducers: (builder) => {
        // Signup
        builder
            .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(signupUser.fulfilled, (state) => { state.loading = false; state.signupSuccess = true; })
            .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null; });

        // OTP verification
        builder
            .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(verifyOtp.fulfilled, (state) => { state.loading = false; state.otpVerified = true; })
            .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null; });

        // Login
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null; });

        // Resend OTP
        builder
            .addCase(resendOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resendOtp.fulfilled, (state) => { state.loading = false; })
            .addCase(resendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? null; });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;