import type { LoginUser, User } from '../../types/User';
import type { UserRegister } from '../../types/api/UserApi';
import type { ChangePasswordPayload, LoginPayload, OtpPayload, ResetPasswordPayload } from '../../types/api/authPayloads';
import { axiosClient } from '../http/axiosClient';
import { UserMapper } from '../../api/mappers/userMappers';
import type { OtpContext } from '../../features/auth/authTypes';
import { AUTH_ROUTES } from '../../constants/authRoutes';
import type { LoginAdmin } from '../../types/Admin';

export const authEndpoints = {
    login: async (credentials: LoginPayload): Promise<LoginUser> => {
        const { data } = await axiosClient.post(AUTH_ROUTES.LOGIN, credentials);
        return UserMapper.toLoginResponseDTO(data.data.user);
    },

    adminLogin: async (credentials: LoginPayload): Promise<LoginAdmin> => {
        const { data } = await axiosClient.post(AUTH_ROUTES.ADMIN_LOGIN, credentials);
        return UserMapper.toLoginResponseDTO(data.data.admin);
    },

    signup: async (userData: UserRegister): Promise<{ user: User; expiresAt: string }> => {
        const { data } = await axiosClient.post(AUTH_ROUTES.SIGNUP(userData.role), userData);
        return {
            user: data.user,
            expiresAt: data.data.expiresAt,
        };
    },

    verifyOtp: async (payload: OtpPayload) => {
        await axiosClient.post(AUTH_ROUTES.VERIFY_OTP, payload);
    },

    resendOtp: async ({ email, context }: { email: string; context: OtpContext }) => {
        await axiosClient.post(AUTH_ROUTES.RESEND_OTP, { email, context });
    },

    logout: async ({ userId, role }: { userId: string | undefined; role: string | undefined }) => {
        await axiosClient.post(AUTH_ROUTES.LOGOUT, { userId, role });
    },

    refreshToken: async (): Promise<LoginUser> => {
        const { data } = await axiosClient.get(AUTH_ROUTES.REFRESH, { withCredentials: true });
        return UserMapper.toLoginResponseDTO(data.data.user);
    },

    forgotPassword: async (email: string): Promise<{ expiresAt: string }> => {
        const { data } = await axiosClient.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
        return data.data;
    },

    verifyResetOtp: async (payload: OtpPayload) => {
        await axiosClient.post(AUTH_ROUTES.VERIFY_RESET_OTP, payload);
    },

    resetPassword: async (payload: ResetPasswordPayload) => {
        await axiosClient.post(AUTH_ROUTES.RESET_PASSWORD, payload);
    },

    changePassword: async (payload: ChangePasswordPayload) => {
        await axiosClient.post(AUTH_ROUTES.CHANGE_PASSWORD, payload);
    },
};
