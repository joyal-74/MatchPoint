import { AuthMessages } from "../constants/AuthMessages";
import type { SignUpForm } from "../utils/helpers/SignupFields";

export type ValidationErrors = Partial<Record<string, string>>;


export const validateSignup = (payload: SignUpForm): ValidationErrors => {
    console.log(payload)
    const errors: ValidationErrors = {};

    if (!payload.firstName) errors.first_name = AuthMessages.FIRST_NAME_REQUIRED;
    if (!payload.lastName) errors.last_name = AuthMessages.LAST_NAME_REQUIRED;

    if (!payload.email || !payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = AuthMessages.INVALID_EMAIL;
    }

    if (!payload.phone || !/^\d{10}$/.test(payload.phone)) {
        errors.phone = AuthMessages.INVALID_PHONE;
    }

    if (!payload.gender) {
        errors.gender = AuthMessages.GENDER_REQUIRED;
    }

    if (!payload.password) errors.password = AuthMessages.PASSWORD_REQUIRED;
    else if (payload.password.length < 6) errors.password = AuthMessages.PASSWORD_TOO_SHORT;

    if (!payload.confirmPassword) errors.confirmPassword = AuthMessages.CONFIRM_PASSWORD_REQUIRED;
    else if (payload.password !== payload.confirmPassword) errors.confirmPassword = AuthMessages.PASSWORDS_DO_NOT_MATCH

    // Optional field for players
    if (payload.role === "player" && !payload.sport) {
        errors.sport = AuthMessages.SPORTS_REQUIRED;
    }

    return errors;
};
