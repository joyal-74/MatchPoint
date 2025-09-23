import { createAsyncThunk } from "@reduxjs/toolkit";
import { authEndpoints } from "../../api/endpoints/authEndPoints";
import { createApiThunk } from "../../utils/createApiThunk";



// User login
export const loginUser = createAsyncThunk("auth/login", createApiThunk(authEndpoints.login));

// Admin login
export const loginAdmin = createAsyncThunk("auth/adminLogin", createApiThunk(authEndpoints.adminLogin));

// User signup
export const signupUser = createAsyncThunk(
    "auth/signup",
    createApiThunk(authEndpoints.signup)
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    createApiThunk(authEndpoints.verifyOtp)
);

// Resend OTP
export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    createApiThunk(authEndpoints.resendOtp)
);

// Logout
export const logoutUser = createAsyncThunk(
    "auth/logout",
    createApiThunk(authEndpoints.logout)
);

// Request Reset OTP
export const requestResetOtp = createAsyncThunk(
    "auth/requestResetOtp",
    createApiThunk(authEndpoints.forgotPassword)
);

// Verify Reset OTP
export const verifyResetOtp = createAsyncThunk(
    "auth/verifyResetOtp",
    createApiThunk(authEndpoints.verifyResetOtp)
);

// Reset Password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    createApiThunk(authEndpoints.resetPassword)
);

// Refresh Token
export const refreshToken = createAsyncThunk(
  "auth/refresToken",
  createApiThunk(authEndpoints.refreshToken)
);
