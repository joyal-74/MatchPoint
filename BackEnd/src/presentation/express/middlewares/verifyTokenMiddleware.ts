import { Request, Response, NextFunction } from "express";
import { IJWTRepository } from "app/repositories/interfaces/providers/IjwtRepository";
import { HttpStatusCode } from "domain/enums/StatusCodes";
import { buildResponse } from "infra/utils/responseBuilder";

interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const verifyTokenMiddleware = (jwtService: IJWTRepository, allowedRoles: string[] = []) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {

        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json(
                buildResponse(false, "No token provided", undefined, "Something went wrong")
            );
        }

        const payload = await jwtService.verifyAccessToken(token);

        req.user = { id: payload.userId, role: payload.role };

        if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
            return res.status(HttpStatusCode.FORBIDDEN).json(
                buildResponse(false, "Forbidden: Insufficient role", undefined, "Something went wrong")
            );
        }

        next();
    };
