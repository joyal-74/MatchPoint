import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { adminEndpoints } from "../../../api/endpoints/adminEndpoints";
import type { ManagerDetails, Player, PlayerDetails, viewerDetails } from "./userTypes";
import type { SignupRole } from "../../../types/UserRoles";
import type { GetAllUsersParams } from "../../../types/api/Params";
import type { User } from "../../../types/User";


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

export const fetchManagerDetails = createAsyncThunk<ManagerDetails, string>(
    "/admin/fetchManagerDetails",
    createApiThunk((id: string) => adminEndpoints.fetchManagerDetails(id))
);

export const fetchPlayerDetails = createAsyncThunk<PlayerDetails, string>(
    "/admin/fetchPlayerDetails",
    createApiThunk((id: string) => adminEndpoints.fetchPlayerDetails(id))
);

export const fetchViewerDetails = createAsyncThunk<viewerDetails, string>(
    "/admin/fetchViewerDetails",
    createApiThunk((id: string) => adminEndpoints.fetchViewerDetails(id))
);

export const userStatusChange = createAsyncThunk(
    "/admin/user/status",
    createApiThunk(({ role, userId, isActive, params }: { role: SignupRole, userId: string; isActive: boolean, params: GetAllUsersParams }) =>
        adminEndpoints.userStatusChange(role, userId, isActive, params)
    )
);