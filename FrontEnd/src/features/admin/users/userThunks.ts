import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { adminEndpoints } from "../../../api/endpoints/adminEndpoints";
import type { Player, User } from "./userTypes";
import type { SignupRole } from "../../../types/UserRoles";
import type { GetAllUsersParams } from "../../../types/api/Params";


export const fetchViewers = createAsyncThunk<{ users: User[], totalCount: number }, { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/viewers",
    createApiThunk(({ page, limit, filter, search }) => adminEndpoints.fetchViewers(page, limit, filter, search))
);

export const fetchPlayers = createAsyncThunk<{ users: Player[], totalCount: number }, { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/players",
    createApiThunk(({ page, limit, filter, search }) => adminEndpoints.fetchPlayers(page, limit, filter, search))
);

export const fetchManagers = createAsyncThunk<{ users: User[], totalCount: number }, { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/managers",
    createApiThunk(({ page, limit, filter, search }) => adminEndpoints.fetchManagers(page, limit, filter, search))
);

export const userStatusChange = createAsyncThunk(
    "/admin/user/status",
    createApiThunk(({ role, userId, isActive, params }: { role: SignupRole, userId: string; isActive: boolean, params: GetAllUsersParams }) =>
        adminEndpoints.userStatusChange(role, userId, isActive, params)
    )
);