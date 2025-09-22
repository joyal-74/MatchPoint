import { AuthMessages } from "../constants/AuthMessages";
import type { LoginRequest } from "../types/api/UserApi";

export type ValidationErrors = Partial<Record<string, string>>;

export const validateLogin = (payload: LoginRequest): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!payload.email || !payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = AuthMessages.INVALID_EMAIL;
    }

    if (!payload.password) errors.password = AuthMessages.PASSWORD_REQUIRED;
    else if (payload.password.length < 6) errors.password = AuthMessages.PASSWORD_TOO_SHORT;

    return errors;
};