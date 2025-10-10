import { BadRequestError } from "domain/errors";
import { Validators } from "./common";

export function validatePlayerInput(data: any) {
    const errors: Record<string, string> = {};

    const email = data.email?.trim();

    const gender = data.gender?.trim();
    const sport = data.sport?.trim();
    const firstName = data.firstName?.trim();
    const lastName = data.lastName?.trim();
    const password = data.password?.trim();

    if (!Validators.notEmpty(email)) {
        errors.email = "Email is required";
    } else if (!Validators.isEmail(email)) {
        errors.email = "Invalid email format";
    }

    if (!Validators.notEmpty(password)) {
        errors.password = "Password is required";
    } else if (!Validators.minLength(password, 6)) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!Validators.notEmpty(firstName)) errors.firstName = "First name is required";
    if (!Validators.notEmpty(lastName)) errors.lastName = "Last name is required";

    if (!Validators.notEmpty(sport)) {
        errors.sport = "Sport is required";
    }

    if (!Validators.isIn(gender, ["male", "female", "other"])) {
        errors.gender = "Invalid gender";
    }

    if (Object.keys(errors).length > 0) {
        throw new BadRequestError("Validation failed", errors);
    }

    return data;
}