import type { User } from "../../types/User";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
} 

export const otpContext = {
    VerifyEmail : 'verify_email',
    ForgotPassword : 'forgot_password'
} as const;

export type OtpContext = typeof otpContext[keyof typeof otpContext];