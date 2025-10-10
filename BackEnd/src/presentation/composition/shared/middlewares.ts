import { verifyTokenMiddleware } from "presentation/express/middlewares/verifyTokenMiddleware";
import { jwtService } from "./providers";

// Role-based access control
export const adminOnly = verifyTokenMiddleware(jwtService, ["admin"]);
export const playerOnly = verifyTokenMiddleware(jwtService, ["player"]);
export const managerOnly = verifyTokenMiddleware(jwtService, ["manager"]);
