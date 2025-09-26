import { AuthMessages } from "../constants/AuthMessages";

export type ValidationErrors = Partial<Record<string, string>>;

export const validateEmail = (payload: { email: string }): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!payload.email || !payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = AuthMessages.INVALID_EMAIL;
    }

    return errors;
};