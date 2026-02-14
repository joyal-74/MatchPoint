import { container } from "tsyringe";
import { AuthMiddleware } from "./authMiddleware.js"; 

const authMiddleware = container.resolve(AuthMiddleware);

// Export pre-configured role checks
export const adminOnly = authMiddleware.restrict(["admin"]);
export const playerOnly = authMiddleware.restrict(["player"]);
export const managerOnly = authMiddleware.restrict(["manager"]);
export const umpireOnly = authMiddleware.restrict(["umpire"]);
export const authAny = authMiddleware.restrict([]);