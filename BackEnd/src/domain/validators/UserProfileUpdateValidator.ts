import { Validators } from "./common";
import { BadRequestError } from "../errors/index";
import { File } from "../entities/File";

export function validateUserProfileUpdata(data, file?: File) {
    const errors: Record<string, string> = {};

    const email = data.email?.trim();
    const phone = data.phone?.trim();
    const gender = data.gender?.trim();


    const firstName = data.firstName?.trim();
    const lastName = data.lastName?.trim();

    if (firstName !== undefined) {
        if (!Validators.minLength(firstName, 2)) {
            errors.firstName = "First name must be at least 2 characters";
        } else if (!Validators.isValidName(firstName)) {
            errors.firstName = "First name cannot contain numbers or special characters like underscores";
        }
    }

    if (lastName !== undefined) {
        if (!Validators.minLength(lastName, 2)) {
            errors.lastName = "Last name must be at least 2 characters";
        } else if (!Validators.isValidName(lastName)) {
            errors.lastName = "Last name cannot contain numbers or special characters like underscores";
        }
    }


    if (email && !Validators.isEmail(email)) {
        errors.email = "Invalid email format";
    }

    if (phone && !Validators.isPhone(phone)) {
        errors.phone = "Invalid phone number";
    }

    if (gender && !Validators.isIn(gender, ["male", "female", "other"])) {
        errors.gender = "Invalid gender";
    }

    // File validation
    if (file) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            errors.file = "Invalid file type. Only PNG/JPG/webp allowed";
        }
    }

    if (Object.keys(errors).length > 0) {
        throw new BadRequestError("Validation failed", errors);
    }

    return data;
}
