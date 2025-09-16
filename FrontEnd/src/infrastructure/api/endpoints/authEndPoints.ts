import type { ApiResponse } from '../../../shared/types/api/ApiResponse';
import type { User } from '../../../core/domain/entities/User';
import { axiosClient } from '../http/axiosClient';
import { mapApiAdminToDomain, mapApiUserToDomain, mapUserForSignup } from '../mappers/userMappers';
import type { LoginAdminResponse, LoginUserResponse, UserResponse } from '../../../shared/types/api/UserResponse';
import type { UserRegister } from '../../../shared/types/api/UserApi';
import { getEndpoint } from '../http/services/authEndPoints';
import type { SignupRole } from '../../../core/domain/types/UserRoles';
import type { Admin } from '../../../core/domain/entities/Admin';

export const authEndpoints = {
    login: async (credentials: { email: string; password: string }): Promise<User> => {
        const response = await axiosClient.post<ApiResponse<LoginUserResponse>>(
            "/login",
            credentials
        );
        return mapApiUserToDomain(response.data.data.user);
    },

    adminLogin: async (credentials: { email: string; password: string }): Promise<Admin> => {
        const response = await axiosClient.post<ApiResponse<LoginAdminResponse>>(
            "/admin/login",
            credentials
        );
        return mapApiAdminToDomain(response.data.data.admin);
    },

    signup: async (data: UserRegister): Promise<{ user: User; expiresAt: string }> => {
        const endpoint = getEndpoint(data.role as SignupRole);

        const response = await axiosClient.post<ApiResponse<any>>(
            endpoint,
            mapUserForSignup(data)
        );

        return {
            user: mapApiUserToDomain(response.data.data.user),
            expiresAt: response.data.data.expiresAt,
        };
    },


    verifyOtp: async (data: { email: string; otp: string }): Promise<void> => {
        await axiosClient.post(`/verify-otp`, data);
    },

    resendOtp: async (email: string): Promise<void> => {
        await axiosClient.post(`/resend-otp`, { email });
    },

    logout: async (): Promise<void> => {
        await axiosClient.post("/logout");
    },

    refreshToken: async (): Promise<User> => {
        const response = await axiosClient.get<ApiResponse<UserResponse>>("/refresh");
        return mapApiUserToDomain(response.data.data.user);
    },

    forgotPassword: async (email: string): Promise<{ expiresAt: string }> => {
        const response = await axiosClient.post<{ data: { expiresAt: string } }>('/forgot-password', { email });
        return response.data.data;
    },

    verifyResetOtp: async (data: { email: string, otp: string }): Promise<void> => {
        await axiosClient.post('/verify-reset-otp', data);
    },

    resetPassword: async (data: { email: string, newPassword: string }): Promise<void> => {
        await axiosClient.post('/reset-password', data);
    },

    validateSession: async (): Promise<User> => {
        const response = await axiosClient.get<ApiResponse<UserResponse>>("/validate-session");
        return mapApiUserToDomain(response.data.data.user);
    },

    changePassword: async (data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void> => {
        await axiosClient.post('/change-password', data);
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await axiosClient.put<ApiResponse<UserResponse>>(
            '/profile',
            data
        );
        return mapApiUserToDomain(response.data.data.user);
    }
};