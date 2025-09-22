export interface LoginPayload {
    email: string;
    password: string;
}

export interface OtpPayload {
    email: string;
    otp: string;
}

export interface ResetPasswordPayload {
    email: string;
    newPassword: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}