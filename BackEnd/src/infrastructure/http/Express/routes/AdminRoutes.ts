import { Router } from "express";
import { AdminController } from "../controllers/AdminController";

import { AdminRepository } from '../../../persistence/repositories/mongo/AdminRepositoryMongo'
import { AuthService } from "@app/services/AuthService";
import { AdminService } from "@app/services/AdminServices";
import { RefreshTokenRepositoryMongo } from "@infra/persistence/repositories/mongo/RefreshTokenRepositoryMongo";

const router = Router();

const adminRepo = new AdminRepository();
const refreshTokenRepo = new RefreshTokenRepositoryMongo();

const authService = new AuthService(refreshTokenRepo);
const adminService = new AdminService(adminRepo, authService);

const adminController = new AdminController(adminService);

// Routes
router.post("/login", (req, res) => adminController.loginAdmin(req, res));

export default router;
