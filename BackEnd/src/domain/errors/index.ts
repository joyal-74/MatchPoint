import { AppError } from "./AppError.js";
import { HttpStatusCode } from "../enums/StatusCodes.js";

export class BadRequestError extends AppError {
    constructor(message = "Bad request", details?: Record<string, string>) {
        console.log(details)
        super(message, HttpStatusCode.BAD_REQUEST, true, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, HttpStatusCode.UNAUTHORIZED);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, HttpStatusCode.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, HttpStatusCode.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, HttpStatusCode.CONFLICT);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

export class ConcurrencyError extends AppError {
    constructor(message = "Concurrency conflict detected. Please retry.") {
        super(message, HttpStatusCode.CONFLICT);
        this.name = "ConcurrencyError";
    }
}
