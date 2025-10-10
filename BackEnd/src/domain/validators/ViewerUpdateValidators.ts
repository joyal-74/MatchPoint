import { Validators } from "./common";
import { BadRequestError } from "domain/errors";
import { File } from "domain/entities/File";

export function validateViewerUpdate(data: any, file?: File) {
    const errors: Record<string, string> = {};

    const id = data._id?.trim();
    const email = data.email?.trim();
    const phone = data.phone?.trim();
    const gender = data.gender?.trim();

    // Only _id is required
    if (!Validators.notEmpty(id)) {
        errors.id = "UserId is required";
    }

    // Optional fields, validate only if they exist
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