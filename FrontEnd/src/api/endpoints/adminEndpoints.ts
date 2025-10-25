import type { GetAllUsersParams } from '../../types/api/Params';
import type { SignupRole } from '../../types/UserRoles';
import { axiosClient } from '../http/axiosClient';
import { ADMIN_ROUTES } from '../../constants/adminRoutes';

export const adminEndpoints = {
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

    userStatusChange: async (role: SignupRole, userId: string, isActive: boolean, params: GetAllUsersParams) => {
        const response = await axiosClient.patch(ADMIN_ROUTES.USER_STATUS_CHANGE(role, userId), { isActive, params });
        const users = response.data.data.users;
        const totalCount = response.data.data.totalCount;
        return { users, role, totalCount };
    },
};