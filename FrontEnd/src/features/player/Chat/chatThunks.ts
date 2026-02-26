import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { messagesEndpoints } from "../../../api/endpoints/chatEndpoints";

export const getUserTeams = createAsyncThunk(
    "chat/getUserTeams",
    createApiThunk(messagesEndpoints.getUserTeams)
);


export const getTeamDetails = createAsyncThunk(
    "chat/getMyTeamDetails",
    createApiThunk(messagesEndpoints.getTeamDetails)
);