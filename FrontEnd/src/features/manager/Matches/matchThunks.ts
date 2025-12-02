import { createAsyncThunk } from "@reduxjs/toolkit";
import { matchEndpoints } from "../../../api/endpoints/matchEndpoints";
import { createApiThunk } from "../../../utils/createApiThunk";

export const loadMatchDashboard = createAsyncThunk(
    "manager/loadMatchDashboard",
    createApiThunk(matchEndpoints.getMatchById)
);