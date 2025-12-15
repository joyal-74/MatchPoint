import type { SignupRole } from "../../types/UserRoles";
import { API_PREFIX } from "../../utils/api";

export const AUTH_ROUTES = {
    LOGIN: `${API_PREFIX}/auth/login`,
    LOGIN_GOOGLE: `${API_PREFIX}/auth/google-login`,
    LOGIN_FACEBOOK: `${API_PREFIX}/auth/facebook-login`,
    SOCIAL_COMPLETE: `${API_PREFIX}/auth/social-complete`,
    ADMIN_LOGIN: `${API_PREFIX}/auth/admin/login`,
    SIGNUP: (role: SignupRole) => `${API_PREFIX}/auth/signup/${role}`,
    VERIFY_OTP: `${API_PREFIX}/auth/verify-otp`,
    RESEND_OTP: `${API_PREFIX}/auth/resend-otp`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
    VERIFY_RESET_OTP: `${API_PREFIX}/auth/verify-reset-otp`,
    RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
} as const;