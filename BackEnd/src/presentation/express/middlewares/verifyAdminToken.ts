import { Request, Response, NextFunction } from "express";
import { IJWTRepository } from "../../../app/repositories/interfaces/providers/IjwtRepository";
import { IAdminRepository } from "../../../app/repositories/interfaces/admin/IAdminRepository";
import { HttpStatusCode } from "../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../infra/utils/responseBuilder";


interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const verifyAdminToken = (jwtService: IJWTRepository, userRepo: IAdminRepository, allowedRoles: string[] = []) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const token =
                req.cookies?.accessToken ||
                req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(
                    buildResponse(false, "No token provided")
                );
            }

            const payload = await jwtService.verifyAccessToken(token);

            const user = await userRepo.findById(payload.userId);

            if (!user) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(buildResponse(false, "User not found"));
            }

            req.user = { id: payload.userId, role: payload.role };

            if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
                return res.status(HttpStatusCode.FORBIDDEN).json(
                    buildResponse(false, "Forbidden: Insufficient role")
                );
            }

            next();
        } catch (error) {
            console.error(error)
            return res.status(HttpStatusCode.UNAUTHORIZED).json(
                buildResponse(false, "Invalid token")
            );
        }
    };
