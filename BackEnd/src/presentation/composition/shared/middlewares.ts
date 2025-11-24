import { verifyTokenMiddleware } from "presentation/express/middlewares/verifyTokenMiddleware";
import { jwtService } from "./providers";
import { adminRepository, userRepository } from "./repositories";
import { verifyAdminToken } from "presentation/express/middlewares/verifyAdminToken";

// Role-based access control
export const adminOnly = verifyAdminToken(jwtService, adminRepository, ["admin"]);
export const playerOnly = verifyTokenMiddleware(jwtService, userRepository, ["player"]);
export const managerOnly = verifyTokenMiddleware(jwtService, userRepository, ["manager"]);
