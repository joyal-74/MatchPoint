import { createSlice } from "@reduxjs/toolkit";
import {
    loginUser, loginAdmin, resendOtp, signupUser, verifyOtp, logoutUser, requestResetOtp,
    verifyResetOtp, resetPassword, refreshToken,
    loginUserSocialComplete,
    loginUserGoogle,
    loginUserFacebook
} from "./authThunks";
import type { AuthUser } from "../../types/User";

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    signupSuccess: boolean;
    tempToken: string | null;
    authProvider: 'google' | 'facebook' | null;
    expiresAt: string | null;
    otpVerified: boolean;
    resetOtpSent: boolean;
    resetOtpVerified: boolean;
    passwordReset: boolean;
    resetEmail?: string;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    signupSuccess: false,
    tempToken: null,
    authProvider: null,
    expiresAt: null,
    otpVerified: false,
    resetOtpSent: false,
    resetOtpVerified: false,
    passwordReset: false,
    isInitialized: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.error = null;
            state.signupSuccess = false;
            state.tempToken = null;
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
        },
        clearResetEmail(state) {
            state.resetEmail = undefined;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setResetData(state, action) {
            state.resetEmail = action.payload.email;
            state.expiresAt = action.payload.expiresAt;
        },
        clearTempToken: (state) => {
            state.tempToken = null;
        },
        clearAuthProvider: (state) => {
            state.authProvider = null;
        },
    },
    extraReducers: (builder) => {
        // Login (Admin)
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Login failed";
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action.payload)
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Login failed";
            });

        builder
            .addCase(loginUserGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserGoogle.fulfilled, (state, action) => {
                console.log(action.payload)
                state.user = action.payload?.user || null;
                state.tempToken = action.payload?.tempToken || null;
                state.authProvider = action.payload?.authProvider || null;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUserGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Login failed";
            });

        builder
            .addCase(loginUserFacebook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserFacebook.fulfilled, (state, action) => {
                console.log(action.payload)
                state.user = action.payload?.user || null;
                state.tempToken = action.payload?.tempToken || null;
                state.authProvider = action.payload?.authProvider || null;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUserFacebook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Login failed";
            });

        builder
            .addCase(loginUserSocialComplete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserSocialComplete.fulfilled, (state, action) => {
                console.log(action.payload)
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginUserSocialComplete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Login failed";
            });

        // Refresh Token (User)
        builder
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.isInitialized = true;
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload as string;
                state.isInitialized = true;
            });

        // Signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
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
            .addCase(resendOtp.fulfilled, (state, action) => {
                state.expiresAt = action.payload.expiresAt;
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
            .addCase(requestResetOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.resetOtpSent = true;
                state.expiresAt = action.payload.expiresAt
                state.resetEmail = action.meta.arg;
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

export const { logout, clearError, resetPasswordFlow, resetSignupState, clearResetEmail, setUser, setResetData, clearTempToken, clearAuthProvider } = authSlice.actions;
export default authSlice.reducer;