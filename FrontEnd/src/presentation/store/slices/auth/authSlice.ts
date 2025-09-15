import { createSlice } from "@reduxjs/toolkit";
import {
    loginUser,
    resendOtp,
    signupUser,
    verifyOtp,
    logoutUser,
    requestResetOtp,
    verifyResetOtp,
    resetPassword
} from "../auth/authThunks";
import type { User } from "../../../../core/domain/entities/User";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    signupSuccess: boolean;
    otpVerified: boolean;
    resetOtpSent: boolean;
    resetOtpVerified: boolean;
    passwordReset: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    signupSuccess: false,
    otpVerified: false,
    resetOtpSent: false,
    resetOtpVerified: false,
    passwordReset: false,
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
            state.resetOtpSent = false;
            state.resetOtpVerified = false;
            state.passwordReset = false;
        },
        clearError(state) {
            state.error = null;
        },
        resetPasswordFlow(state) {
            state.resetOtpSent = false;
            state.resetOtpVerified = false;
            state.passwordReset = false;
        },
        resetSignupState(state) {
            state.signupSuccess = false;
            state.otpVerified = false;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Login failed";
            });

        // Signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
                state.signupSuccess = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Signup failed";
            });

        // OTP verification (for signup)
        builder
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
                state.error = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "OTP verification failed";
            });

        // Resend OTP (for signup)
        builder
            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to resend OTP";
            });

        // Request reset OTP (forgot password)
        builder
            .addCase(requestResetOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestResetOtp.fulfilled, (state) => {
                state.loading = false;
                state.resetOtpSent = true;
                state.error = null;
            })
            .addCase(requestResetOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to send reset OTP";
            });

        // Verify reset OTP (forgot password)
        builder
            .addCase(verifyResetOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyResetOtp.fulfilled, (state) => {
                state.loading = false;
                state.resetOtpVerified = true;
                state.error = null;
            })
            .addCase(verifyResetOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Reset OTP verification failed";
            });

        // Reset password
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.passwordReset = true;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Password reset failed";
            });

        // Logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.error = null;
                // Reset all states on logout
                state.signupSuccess = false;
                state.otpVerified = false;
                state.resetOtpSent = false;
                state.resetOtpVerified = false;
                state.passwordReset = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Logout failed";
            });
    },
});

export const { logout, clearError, resetPasswordFlow, resetSignupState } = authSlice.actions;
export default authSlice.reducer;