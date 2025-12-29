import type { GetAllUsersParams } from '../../types/api/Params';
import type { SignupRole } from '../../types/UserRoles';
import { axiosClient } from '../http/axiosClient';
import { ADMIN_ROUTES } from '../../constants/routes/adminRoutes';

export const adminEndpoints = {
    getDashboardStats: async () => {
        const response = await axiosClient.get(ADMIN_ROUTES.DASHBOARD);
        return response.data.data;
    },

    fetchViewers: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.VIEWERS, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchPlayers: async (page = 1, limit = 5, filter?: string, search?: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.PLAYERS, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchManagers: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.MANAGERS, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchTeams: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.TEAMS, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchTournaments: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.TOURNAMENTS, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchManagerDetails: async (id: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.MANAGER_DETAILS(id));
        return response.data.data;
    },

    fetchTeamDetails: async (id: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.TEAM_DETAILS(id));
        console.log(response.data)
        return response.data.data;
    },

    updateTeamStatus: async ({ id, status }: { id: string, status: string }) => {
        const response = await axiosClient.patch(ADMIN_ROUTES.TEAM_STATUS_TOGGLE(id), { status });
        return response.data.data;
    },

    fetchPlayerDetails: async (id: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.PLAYER_DETAILS(id));
        return response.data.data;
    },

    fetchViewerDetails: async (id: string) => {
        const response = await axiosClient.get(ADMIN_ROUTES.VIEWER_DETAILS(id));
        return response.data.data;
    },

    userStatusChange: async (role: SignupRole, userId: string, isActive: boolean, params: GetAllUsersParams) => {
        const response = await axiosClient.patch(ADMIN_ROUTES.USER_STATUS_CHANGE(role, userId), { isActive, params });
        const users = response.data.data.users;
        const totalCount = response.data.data.totalCount;
        return { users, role, totalCount };
    },

    teamStatusChange: async (teamId: string, status: 'active' | 'blocked', params: GetAllUsersParams) => {
        const response = await axiosClient.patch(ADMIN_ROUTES.TEAM_STATUS_CHANGE(teamId), { status, params });
        const teams = response.data.data.teams;
        const totalCount = response.data.data.totalCount;
        return { teams, totalCount };
    },

    tournamentStatusChange: async (tourId: string, isActive: boolean, params: GetAllUsersParams) => {
        const response = await axiosClient.patch(ADMIN_ROUTES.TOURNAMENT_STATUS_CHANGE(tourId), { isActive, params });
        const tournaments = response.data.data.tournamnets;
        const totalCount = response.data.data.totalCount;
        return { tournaments, totalCount };
    },

    userBlockStatus: async (userId: string, isActive: boolean,) => {
        const response = await axiosClient.patch(ADMIN_ROUTES.USER_BLOCK_STATUS(userId), { isActive });
        return response.data.data;
    },
};