import { Request, Response, NextFunction } from "express";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { inject, injectable } from "tsyringe";
import { IJWTRepository } from "../../../app/repositories/interfaces/providers/IjwtRepository";
import { IUserRepository } from "../../../app/repositories/interfaces/shared/IUserRepository";
import { HttpStatusCode } from "../../../domain/enums/StatusCodes";
import { buildResponse } from "../../../infra/utils/responseBuilder";
import { IAdminRepository } from "../../../app/repositories/interfaces/admin/IAdminRepository";
import { AdminResponse } from "../../../domain/entities/Admin";
import { UserResponseDTO } from "../../../domain/dtos/User.dto";


export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(DI_TOKENS.JWTService) private _jwtService: IJWTRepository,
        @inject(DI_TOKENS.UserRepository) private _userRepo: IUserRepository,
        @inject(DI_TOKENS.AdminRepository) private _adminRepo: IAdminRepository
    ) { }

    public restrict(allowedRoles: string[] = []) {
        return async (req: AuthRequest, res: Response, next: NextFunction) => {
            try {
                const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

                if (!token) {
                    return res.status(HttpStatusCode.UNAUTHORIZED)
                        .json(buildResponse(false, "No token provided"));
                }

                const payload = await this._jwtService.verifyAccessToken(token);

                let user : AdminResponse | UserResponseDTO | null;
                if(payload.role === 'admin'){
                    user = await this._adminRepo.findById(payload.userId);
                }else{
                    user = await this._userRepo.findById(payload.userId);
                }

                if (!user) {
                    return res.status(HttpStatusCode.UNAUTHORIZED)
                        .json(buildResponse(false, "User not found"));
                }

                if (user.isActive === false) {
                    return res.status(HttpStatusCode.FORBIDDEN)
                        .json(buildResponse(false, "You are blocked"));
                }

                // 4. Role Authorization
                if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
                    return res.status(HttpStatusCode.FORBIDDEN)
                        .json(buildResponse(false, "Forbidden: Insufficient role"));
                }

                // 5. Attach to Request
                req.user = { id: payload.userId, role: payload.role };
                next();
            } catch (error) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json(buildResponse(false, "Invalid or expired token", error));
            }
        };
    }
}
