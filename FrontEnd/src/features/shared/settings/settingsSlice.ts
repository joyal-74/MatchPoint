import { createSlice, } from "@reduxjs/toolkit";
import { updatePassword, updatePrivacySettings, verifyCurrentPassword } from "./settingsThunk";

// --- Types ---
interface SettingsState {
    isLoading: boolean;
    isVerifying: boolean; 
    isPasswordVerified: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: SettingsState = {
    isLoading: false,
    isVerifying: false,
    isPasswordVerified: false,
    error: null,
    successMessage: null,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        resetSettingsState: (state) => {
            state.isPasswordVerified = false;
            state.successMessage = null;
            state.error = null;
        },
        invalidatePasswordVerification: (state) => {
            state.isPasswordVerified = false;
            state.error = null; 
        }
    },
    extraReducers: (builder) => {
        // -- Verify Password Cases --
        builder.addCase(verifyCurrentPassword.pending, (state) => {
            state.isVerifying = true;
            state.error = null;
            state.isPasswordVerified = false;
        });
        builder.addCase(verifyCurrentPassword.fulfilled, (state) => {
            state.isVerifying = false;
            state.isPasswordVerified = true;
            state.error = null;
        });
        builder.addCase(verifyCurrentPassword.rejected, (state) => {
            state.isVerifying = false;
            state.isPasswordVerified = false;

        });

        // -- Update Password Cases --
        builder.addCase(updatePassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updatePassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = action.payload as string;
            state.isPasswordVerified = false;
        });
        builder.addCase(updatePassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // -- Update Privacy Cases --
        builder.addCase(updatePrivacySettings.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updatePrivacySettings.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = action.payload as string;
        });
        builder.addCase(updatePrivacySettings.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    },
});

export const { resetSettingsState, invalidatePasswordVerification } = settingsSlice.actions;
export default settingsSlice.reducer;