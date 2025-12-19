import { createAsyncThunk } from "@reduxjs/toolkit";
import { settingsEndpoints } from "../../../api/endpoints/settingsEndpoints";
import { createApiThunk } from "../../../utils/createApiThunk";


export const verifyCurrentPassword = createAsyncThunk(
    "subscription/verifyCurrentPassword",
    createApiThunk(settingsEndpoints.verifyCurrentPassword)
);

export const updatePassword = createAsyncThunk(
    "subscription/updatePassword",
    createApiThunk(settingsEndpoints.updatePassword)
);

export const updatePrivacySettings = createAsyncThunk(
    "subscription/updatePrivacy",
    createApiThunk(settingsEndpoints.updatePrivacy)
);
