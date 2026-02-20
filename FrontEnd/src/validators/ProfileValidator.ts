import { sportProfileConfig } from "../utils/sportsConfig"; 

export type ValidationErrors = Record<string, string>;

export const validateProfile = (data: any, type: "user" | "sport"): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (type === "user") {
        const nameRegex = /^[a-zA-Z\s-]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if (!data.firstName?.trim()) {
            errors.firstName = "First name is required";
        } else if (!nameRegex.test(data.firstName)) {
            errors.firstName = "Letters, spaces, and hyphens only";
        }

        if (!data.lastName?.trim()) {
            errors.lastName = "Last name is required";
        } else if (!nameRegex.test(data.lastName)) {
            errors.lastName = "Letters, spaces, and hyphens only";
        }

        if (!data.username?.trim()) {
            errors.username = "Username is required";
        } else if (!usernameRegex.test(data.username)) {
            errors.username = "Letters, numbers, and underscores only";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(data.email)) {
            errors.email = "Enter a valid email address";
        }

        if (data.phone && !/^\d{10}$/.test(data.phone.replace(/\D/g, ''))) {
            errors.phone = "Phone must be exactly 10 digits";
        }
    }

    if (type === "sport") {
        const selectedSport = data.sport?.toLowerCase();
        const configFields = sportProfileConfig[selectedSport] || [];

        configFields.forEach((field) => {
            const value = data.profile?.[field.key];

            if (!value || value === "") {
                errors[field.key] = `Please select your ${field.label.toLowerCase()}`;
            }

            if (field.type === "number") {
                if (value && (isNaN(Number(value)) || Number(value) < 0)) {
                    errors[field.key] = "Must be a valid positive number";
                }
                if (value && Number(value) > 999) {
                    errors[field.key] = "Number is too high";
                }
            }
        });
    }

    return errors;
};