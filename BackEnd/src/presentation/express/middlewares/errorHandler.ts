import { ErrorRequestHandler } from "express";
import { AppError } from "domain/errors/AppError";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof AppError) {

        res.status(err.statusCode).json(
            buildResponse(false, err.message, err.details)
        );
        return;
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildResponse(false, err.message, undefined, "Something went wrong")
    );
};