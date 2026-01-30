import { Request, Response, NextFunction } from "express";
import { AppError } from "domain/errors/AppError";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";
import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";
import { ILogger } from "app/providers/ILogger";

@injectable()
export class ErrorHandler {
    constructor(
        @inject(DI_TOKENS.Logger) private readonly logger: ILogger
    ) {}

    public handle = (err: any, req: Request, res: Response, next: NextFunction) => {
        this.logger.error(`${err.message}${err.stack ? `\nStack: ${err.stack}` : ""}`);

        if (err instanceof AppError) {
            return res.status(err.statusCode).json(
                buildResponse(false, err.message, err.details)
            );
        }

        // Handle unknown internal errors
        const status = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
        const message = err.message || "Something went wrong";

        return res.status(status).json(
            buildResponse(false, message, undefined, "Internal Server Error")
        );
    };
}