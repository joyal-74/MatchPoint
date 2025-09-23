import type { GetAllUsersParams } from '../../types/api/Params';
import type { SignupRole } from '../../types/UserRoles';
import { axiosClient } from '../http/axiosClient';

export const userEndpoints = {

    fetchViewers: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(`/admin/viewers`, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchPlayers: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(`/admin/players`, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    fetchManagers: async (page = 1, limit = 10, filter?: string, search?: string) => {
        const response = await axiosClient.get(`/admin/managers`, {
            params: { page, limit, filter, search },
        });
        return response.data.data;
    },

    userStatusChange: async (role: SignupRole, userId: string, isActive: boolean, params : GetAllUsersParams ) => {
        const response = await axiosClient.patch(`/admin/${role}/${userId}/status`, { isActive, params });
        const users = response.data.data
        return { users, role};
    },
}