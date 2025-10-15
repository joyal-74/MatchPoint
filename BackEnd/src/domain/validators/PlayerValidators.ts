import { BadRequestError } from "domain/errors";
import { Validators } from "./common";
import { File } from "domain/entities/File";

export function validatePlayerInput(data, file?: File) {
    const errors: Record<string, string> = {};

    const email = data.email?.trim();

    const gender = data.gender?.trim();
    const sport = data.sport?.trim();
    const firstName = data.firstName?.trim();
    const lastName = data.lastName?.trim();
    const password = data.password?.trim();
    const jerseyNumber = data.jerseyNumber?.toString().trim();


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

    if (jerseyNumber) {
        const num = Number(jerseyNumber);
        if (!Number.isInteger(num) || num < 1 || num > 99) {
            errors.jerseyNumber = "Jersey number must be a valid integer between 1 and 99";
        }
    }

    if (file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            errors.file = "Invalid file type. Only PNG/JPG allowed";
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new BadRequestError("Validation failed", errors);
    }

    return data;
}