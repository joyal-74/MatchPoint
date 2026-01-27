import { AuthMessages } from "../constants/AuthMessages";
import type { LoginRequest } from "../types/api/UserApi";

export type ValidationErrors = Partial<Record<string, string>>;

export const validateLogin = (payload: LoginRequest): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Email Validation
    if (!payload.email) {
        errors.email = "Email is required";
    } else if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = AuthMessages.INVALID_EMAIL;
    }

    // Password Validation
    if (!payload.password) {
        errors.password = AuthMessages.PASSWORD_REQUIRED;
    } else if (payload.password.length < 6) {
        errors.password = AuthMessages.PASSWORD_TOO_SHORT;
    }

    return errors;
};