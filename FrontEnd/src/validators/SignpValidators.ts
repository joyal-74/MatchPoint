import { AuthMessages } from "../constants/AuthMessages";
import { UserRole } from "../types/UserRoles";
import type { SignUpFormExtended } from "../hooks/useSignup";

export type ValidationErrors = Partial<Record<keyof SignUpFormExtended, string>>;

export const validateSignup = (payload: SignUpFormExtended): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Regex Patterns
    const nameRegex = /^[a-zA-Z\s-]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;

    // STEP 1
    if (!payload.firstName.trim()) {
        errors.firstName = AuthMessages.FIRST_NAME_REQUIRED;
    } else if (!nameRegex.test(payload.firstName)) {
        errors.firstName = "Numbers/Special characters not allowed";
    }

    if (!payload.lastName.trim()) {
        errors.lastName = AuthMessages.LAST_NAME_REQUIRED;
    } else if (!nameRegex.test(payload.lastName)) {
        errors.lastName = "Numbers/Special characters not allowed";
    }

    // STEP 2
    if (payload.role === UserRole.Player) {
        if (!payload.battingStyle || payload.battingStyle.trim() === "") {
            errors.battingStyle = "Please select your batting hand";
        }

        if (!payload.bowlingStyle?.trim()) {
            errors.bowlingStyle = "Bowling style (e.g., Fast, Leg-spin) required";
        }

        if (!payload.playingPosition?.trim()) {
            errors.playingPosition = "Position (e.g., Midfielder, Opener) required";
        }

        if (!payload.jerseyNumber) {
            errors.jerseyNumber = "Jersey number is required";
        } else {
            const jNum = Number(payload.jerseyNumber);
            if (isNaN(jNum) || jNum < 0 || jNum > 999) {
                errors.jerseyNumber = "Must be between 0-999";
            }
        }
    }

    // STEP 3
    if (!payload.email || !emailRegex.test(payload.email)) {
        errors.email = AuthMessages.INVALID_EMAIL;
    }

    if (!payload.phone) {
        errors.phone = "Phone number required";
    } else if (!phoneRegex.test(payload.phone.replace(/\s/g, ""))) {
        errors.phone = "Invalid format (e.g., +1234567890)";
    }

    if (!payload.gender) {
        errors.gender = AuthMessages.GENDER_REQUIRED;
    }

    // Password Logic
    if (!payload.password) {
        errors.password = AuthMessages.PASSWORD_REQUIRED;
    } else if (payload.password.length < 6) {
        errors.password = AuthMessages.PASSWORD_TOO_SHORT;
    }

    if (!payload.confirmPassword) {
        errors.confirmPassword = AuthMessages.CONFIRM_PASSWORD_REQUIRED;
    } else if (payload.password !== payload.confirmPassword) {
        errors.confirmPassword = AuthMessages.PASSWORDS_DO_NOT_MATCH;
    }

    if (!payload.profileImage) {
        errors.profileImage = "Please select Profile image";
    }

    return errors;
};