export interface LoginPayload {
    email: string;
    password: string;
}

export interface OtpPayload {
    email: string;
    otp: string;
    context: 'verify_email' | 'forgot_password';
}

export interface ResetPasswordPayload {
    email: string;
    newPassword: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}