import type { ApiResponse } from '../../../shared/types/api/ApiResponse';
import type { User } from '../../../core/domain/entities/User';
import { axiosClient } from '../http/axiosClient';
import { mapApiUserToDomain } from '../mappers/userMappers';
import type { LoginUserResponse, UserResponse } from '../../../shared/types/api/UserResponse';
import type { UserRegister } from '../../../shared/types/api/UserApi';

export const authEndpoints = {
    login: async (credentials: { email: string; password: string }): Promise<User> => {
        const response = await axiosClient.post<ApiResponse<LoginUserResponse>>(
            "/login",
            credentials
        );
        return mapApiUserToDomain(response.data.data.user);
    },

    signup: async (data: UserRegister): Promise<User> => {
        const response = await axiosClient.post<ApiResponse<UserResponse>>(
            "/signup",
            data
        );
        return mapApiUserToDomain(response.data.data.user);
    },

    verifyOtp: async (data: { email: string; otp: string }): Promise<void> => {
        await axiosClient.post(`/auth/verify-otp`, data);
    },

    resendOtp: async (email: string): Promise<void> => {
        await axiosClient.post(`resend-otp`, email);
    },

    logout: async (): Promise<void> => {
        await axiosClient.post("/logout");
    },

    refresh: async (): Promise<User> => {
        const response = await axiosClient.get<ApiResponse<UserResponse>>("/auth/refresh");
        return mapApiUserToDomain(response.data.data.user);
    },

    forgotPassword: async (email: string): Promise<void> => {
        await axiosClient.post('/forgot_password', email)
    },

    verifyResetOtp: async (data: { email: string, otp: string }): Promise<void> => {
        await axiosClient.post('/verify-reset-otp', data)
    },

    resetPassword: async (data: { email: string, newPassword: string }): Promise<void> => {
        await axiosClient.post('/reset-password', data)
    }
};