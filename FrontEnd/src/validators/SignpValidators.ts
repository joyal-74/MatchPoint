import { AuthMessages } from "../constants/AuthMessages";
import type { SignUpForm } from "../utils/helpers/SignupFields";

export type ValidationErrors = Partial<Record<string, string>>;


export const validateSignup = (payload: SignUpForm): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!payload.first_name) errors.firstName = AuthMessages.FIRST_NAME_REQUIRED;
    if (!payload.last_name) errors.lastName = AuthMessages.LAST_NAME_REQUIRED;

    if (!payload.email || !payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = AuthMessages.INVALID_EMAIL;
    }

    if (!payload.phone || !/^\d{10}$/.test(payload.phone)) {
        errors.phone = AuthMessages.INVALID_PHONE;
    }

    if (!payload.password) errors.password = AuthMessages.PASSWORD_REQUIRED;
    else if (payload.password.length < 6) errors.password = AuthMessages.PASSWORD_TOO_SHORT;

    if (!payload.confirmPassword) errors.confirmPassword = AuthMessages.CONFIRM_PASSWORD_REQUIRED;
    else if (payload.password !== payload.confirmPassword) errors.confirmPassword = AuthMessages.PASSWORDS_DO_NOT_MATCH

    // Optional field for players
    if ("sports" in payload && (!payload.sports || payload.sports === "")) {
        errors.sports = AuthMessages.SPORTS_REQUIRED;
    }

    return errors;
};
