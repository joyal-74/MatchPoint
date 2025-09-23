import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { userEndpoints } from "../../../api/endpoints/userEndpoints";
import type { User } from "./userTypes";
import type { SignupRole } from "../../../types/UserRoles";
import type { GetAllUsersParams } from "../../../types/api/Params";


export const fetchViewers = createAsyncThunk<User[], { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/viewers",
    createApiThunk(({ page, limit, filter, search }) => userEndpoints.fetchViewers(page, limit, filter, search))
);

export const fetchPlayers = createAsyncThunk<User[], { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/players",
    createApiThunk(({ page, limit, filter, search }) => userEndpoints.fetchPlayers(page, limit, filter, search))
);

export const fetchManagers = createAsyncThunk<User[], { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/managers",
    createApiThunk(({ page, limit, filter, search }) => userEndpoints.fetchPlayers(page, limit, filter, search))
);

export const userStatusChange = createAsyncThunk(
    "/admin/user/status",
    createApiThunk(({ role, userId, isActive, params }: { role : SignupRole, userId: string; isActive: boolean, params : GetAllUsersParams }) =>
        userEndpoints.userStatusChange(role, userId, isActive, params)
    )
);