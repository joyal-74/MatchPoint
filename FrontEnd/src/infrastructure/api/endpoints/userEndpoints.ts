import type { ApiResponse } from '../../../shared/types/api/ApiResponse';
import type { User } from '../../../core/domain/entities/User';
import { axiosClient } from '../http/axiosClient';
import { mapApiUserToDomain } from '../mappers/userMappers';
import type {UserResponse, UsersResponse} from '../../../shared/types/api/UserResponse'
import type { Role } from '../../../core/domain/enums/UserRole';


export const userEndpoints = {
    getAllUsers: async (
        role : Role,
        page: number = 1,
        limit: number = 10,
        search?: string
    ): Promise<{ users: User[]; total: number }> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
        });

        const response = await axiosClient.get<ApiResponse<UsersResponse>>(
            `/${role}?${params.toString()}`
        );

        return {
            users: response.data.data.users.map(mapApiUserToDomain),
            total: response.data.data.total,
        };
    },


    getUserById: async (id: string,  role : Role): Promise<User> => {
        const response = await axiosClient.get<ApiResponse<UserResponse>>(
            `/${role}/${id}`
        );
        return mapApiUserToDomain(response.data.data.user);
    },

    getUserByEmail: async (email: string, role : Role): Promise<User | null> => {
        try {
            const response = await axiosClient.get<ApiResponse<UserResponse>>(
                `/${role}/${email}`
            );
            return mapApiUserToDomain(response.data.data.user);
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }
};


export default userEndpoints;