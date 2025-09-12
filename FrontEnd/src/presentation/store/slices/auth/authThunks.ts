import { createAsyncThunk } from "@reduxjs/toolkit";
import { authEndpoints } from "../../../../infrastructure/api/endpoints/authEndPoints";
import type { UserRegister } from "../../../../shared/types/api/UserApi";
import type { User } from "../../../../core/domain/entities/User";

export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
    "/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const user = await authEndpoints.login(credentials);
            return user;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);


export const signupUser = createAsyncThunk<void, UserRegister, { rejectValue: string }>(
    "/signup",
    async (credentials, { rejectWithValue }) => {
        try {
            await authEndpoints.signup(credentials);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Verification failed");
        }
    }
);

export const verifyOtp = createAsyncThunk<void, { email: string; otp: string }, { rejectValue: string }>(
    "auth/verifyOtp",
    async (data: { email: string, otp: string }, { rejectWithValue }) => {
        try {
            await authEndpoints.verifyOtp(data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "OTP verification failed");
        }
    }
);

export const resendOtp = createAsyncThunk<void, string, { rejectValue: string }>(
    "auth/resendOtp",
    async (email, { rejectWithValue }) => {
        try {
            await authEndpoints.resendOtp(email);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Resend OTP failed");
        }
    }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
    "/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authEndpoints.logout();
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Logout failed");
        }
    }
);


export const requestResetOtp = createAsyncThunk<void, string, { rejectValue: string }>(
    "auth/requestResetOtp",
    async (email, { rejectWithValue }) => {
        try {
            await authEndpoints.forgotPassword(email);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
        }
    }
);

// Verify OTP
export const verifyResetOtp = createAsyncThunk<void, { email: string; otp: string }, { rejectValue: string }>(
    "auth/verifyResetOtp",
    async (data, { rejectWithValue }) => {
        try {
            await authEndpoints.verifyResetOtp(data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "OTP verification failed");
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk<void, { email: string; newPassword: string }, { rejectValue: string }>(
    "auth/resetPassword",
    async (data, { rejectWithValue }) => {
        try {
            await authEndpoints.resetPassword(data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Reset password failed");
        }
    }
);