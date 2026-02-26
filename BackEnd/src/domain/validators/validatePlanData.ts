import { Plan } from "../entities/Plan";
import { BadRequestError } from "../errors/index";

export function validatePlanData(data: Partial<Plan>) {
    const errors: Record<string, string> = {};

    if (data.price !== undefined && data.price < 0) {
        errors.price = "Price cannot be negative";
    }

    if (data.title !== undefined && data.title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters long";
    }

    if (data.features && (!Array.isArray(data.features) || data.features.length === 0)) {
        errors.features = "Plan must include at least one feature";
    }

    if (Object.keys(errors).length > 0) {
        throw new BadRequestError("Validation failed", errors);
    }
}
