import { createAsyncThunk } from "@reduxjs/toolkit";
import { authEndpoints } from "../../../../infrastructure/api/endpoints/authEndPoints";
import type { SignupResponse, UserRegister } from "../../../../shared/types/api/UserApi";
import type { User } from "../../../../core/domain/entities/User";

export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
    "/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const user = await authEndpoints.login(credentials);
            return user;
        } catch (err: any) {
            console.log(err)
            return rejectWithValue(err.response?.data?.error.message || "Login failed");
        }
    }
);

export const signupUser = createAsyncThunk<SignupResponse, UserRegister, { rejectValue: string }>(
    "/signup",
    async (credentials, { rejectWithValue }) => {
        try {
            const user = await authEndpoints.signup(credentials);
            return user;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error);
        }
    }
);


export const verifyOtp = createAsyncThunk<void, { email: string; otp: string }, { rejectValue: string }>(
    "/verifyOtp",
    async (data: { email: string, otp: string }, { rejectWithValue }) => {
        try {
            await authEndpoints.verifyOtp(data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "OTP verification failed");
        }
    }
);

export const resendOtp = createAsyncThunk<void, string, { rejectValue: string }>(
    "/resendOtp",
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


export const requestResetOtp = createAsyncThunk<{ expiresAt: string },string,{ rejectValue: string }>(
    "/requestResetOtp",
    async (email, { rejectWithValue }) => {
        try {
            const { expiresAt } = await authEndpoints.forgotPassword(email);
            return { expiresAt };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
        }
    }
);


// Verify OTP
export const verifyResetOtp = createAsyncThunk<void, { email: string; otp: string }, { rejectValue: string }>(
    "/verifyResetOtp",
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
    "/resetPassword",
    async (data, { rejectWithValue }) => {
        try {
            await authEndpoints.resetPassword(data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Reset password failed");
        }
    }
);


export const refreshToken = createAsyncThunk<User, void, { rejectValue: string }>(
    "/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const user = await authEndpoints.refreshToken();
            return user;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Token refresh failed");
        }
    }
);


export const validateSession = createAsyncThunk<User, void, { rejectValue: string }>(
    "/validate-session",
    async (_, { rejectWithValue }) => {
        try {
            const user = await authEndpoints.validateSession();
            return user;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Session validation failed");
        }
    }
);