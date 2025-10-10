import { ErrorRequestHandler } from "express";
import { AppError } from "domain/errors/AppError";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { logger } from "presentation/composition/shared/providers";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    logger.error(err.message, {
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (err instanceof AppError) {

        return res.status(err.statusCode).json(buildResponse(false, err.message, err.details));
    }

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildResponse(false, err.message, undefined, "Something went wrong")
    );
};