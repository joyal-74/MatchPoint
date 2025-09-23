import type { User } from '../../types/User';
import type { Admin } from '../../types/Admin';
import type { UserRegister } from '../../types/api/UserApi';
import type { SignupRole } from '../../types/UserRoles';
import type { ChangePasswordPayload, LoginPayload, OtpPayload, ResetPasswordPayload } from '../../types/api/authPayloads';
import { axiosClient } from '../http/axiosClient';
import { mapApiUserToDomain, mapApiAdminToDomain, mapUserForSignup } from '../../api/mappers/userMappers';
import { getEndpoint } from '../../services/authEndPoints';
import type { OtpContext } from '../../features/auth/authTypes';


export const authEndpoints = {
    login: async (credentials: LoginPayload): Promise<User> => {
        const { data } = await axiosClient.post(`/auth/login`, credentials);
        return mapApiUserToDomain(data.data.user);
    },

    adminLogin: async (credentials: LoginPayload): Promise<Admin> => {
        const { data } = await axiosClient.post(`/auth/admin/login`, credentials);
        return mapApiAdminToDomain(data.data.admin);
    },

    signup: async (data: UserRegister): Promise<{ user: User; expiresAt: string }> => {
        const endpoint = getEndpoint(data.role as SignupRole);
        const { data: response } = await axiosClient.post(endpoint, mapUserForSignup(data));
        return {
            user: mapApiUserToDomain(response.data.user),
            expiresAt: response.data.expiresAt,
        };
    },

    verifyOtp: async (payload: OtpPayload) => {
        await axiosClient.post(`/auth/verify-otp`, payload);
    },

    resendOtp: async ({ email, context }: { email: string; context: OtpContext }) => {
        await axiosClient.post(`/auth/resend-otp`, { email, context });
    },


    logout: async () => {
        await axiosClient.post(`/auth/logout`);
    },

    refreshToken: async (): Promise<User> => {
        const { data } = await axiosClient.get(`/auth/refresh`, { withCredentials: true });
        return mapApiUserToDomain(data.data.user);
    },

    forgotPassword: async (email: string): Promise<{ expiresAt: string }> => {
        const { data } = await axiosClient.post(`/auth/forgot-password`, { email });
        return data.data;
    },

    verifyResetOtp: async (payload: OtpPayload) => {
        await axiosClient.post(`/auth/verify-reset-otp`, payload);
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
        await axiosClient.post(`/auth/reset-password`, payload);
    },

    changePassword: async (payload: ChangePasswordPayload) => {
        await axiosClient.post(`/auth/change-password`, payload);
    },
};