import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiThunk } from "../../../utils/createApiThunk";
import { adminEndpoints } from "../../../api/endpoints/adminEndpoints";
import type { Team, Tournament } from "./tournamentTypes";
import type { GetAllUsersParams } from "../../../types/api/Params";


export const fetchTeams = createAsyncThunk<{ teams: Team[], totalCount: number }, { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/teams",
    createApiThunk(({ page, limit, filter, search }) => adminEndpoints.fetchTeams(page, limit, filter, search))
);

export const fetchTeamDetails = createAsyncThunk(
    "/admin/teams/details",
    createApiThunk(adminEndpoints.fetchTeamDetails)
);

export const updateTeamStatus = createAsyncThunk(
    "/admin/teams/update/status",
    createApiThunk(adminEndpoints.updateTeamStatus)
);

export const fetchTournaments = createAsyncThunk<{ tournaments: Tournament[], totalCount: number }, { page: number; limit: number; filter?: string; search?: string }>(
    "/admin/tournamnets",
    createApiThunk(({ page, limit, filter, search }) => adminEndpoints.fetchTournaments(page, limit, filter, search))
);


export const teamStatusChange = createAsyncThunk(
    "/admin/team/status",
    createApiThunk(({ teamId, status, params }: { teamId: string; status: 'active' | 'blocked', params: GetAllUsersParams }) =>
        adminEndpoints.teamStatusChange(teamId, status, params)
    )
);

export const tournamentStatusChange = createAsyncThunk(
    "/admin/tournament/status",
    createApiThunk(({ tourId, isActive, params }: { tourId: string; isActive: boolean, params: GetAllUsersParams }) =>
        adminEndpoints.tournamentStatusChange(tourId, isActive, params)
    )
);