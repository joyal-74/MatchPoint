import type { SignupRole } from "../types/UserRoles";

export const AUTH_ROUTES = {
    LOGIN: "/auth/login",
    LOGIN_GOOGLE: "/auth/google-login",
    GOOGLE_COMPLETE: "/auth/google-complete",
    ADMIN_LOGIN: "/auth/admin/login",
    SIGNUP: (role:  SignupRole) => `/auth/signup/${role}`,
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
} as const;