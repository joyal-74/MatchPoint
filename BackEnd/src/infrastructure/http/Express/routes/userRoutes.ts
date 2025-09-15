import { Router } from "express";
import { UserController } from "../controllers/UserController";

// services
import { UserService } from "../../../../core/domain/usecases/admin/UserService";
import { PlayerService } from "../../../../core/domain/usecases/admin/PlayerService";
import { CareerStatsService } from "../../../../core/domain/usecases/admin/CareerStatService";
import { AuthService } from "@app/services/AuthService";

import { UserRepositoryMongo } from "@infra/persistence/repositories/mongo/UserRepositoryMongo"; 
import { PlayerRepositoryMongo } from "@infra/persistence/repositories/mongo/PlayerRepositoryMongo"; 
import { CareerStatsRepositoryMongo } from "@infra/persistence/repositories/mongo/CareerStatsRepositoryMongo"; 
import { RefreshTokenRepositoryMongo } from "@infra/persistence/repositories/mongo/RefreshTokenRepositoryMongo";

const router = Router();

const userRepo = new UserRepositoryMongo();
const playerRepo = new PlayerRepositoryMongo();
const careerStatsRepo = new CareerStatsRepositoryMongo();
const refreshTokenRepo = new RefreshTokenRepositoryMongo()

const userService = new UserService(userRepo);
const playerService = new PlayerService(playerRepo);
const careerStatsService = new CareerStatsService(careerStatsRepo);
const authService = new AuthService(refreshTokenRepo);

const userController = new UserController(userService, playerService, careerStatsService, authService);


router.get("/admin/viewers",(req, res) => userController.getAllViewers(req, res));
router.get("/admin/players",(req, res) => userController.getAllPlayers(req, res));
router.get("/admin/managers",(req, res) => userController.getAllManagers(req, res));

router.post("/signup/viewer", (req, res) => userController.signupViewer(req, res));
router.post("/signup/player", (req, res) => userController.signupPlayer(req, res));
router.post("/signup/manager", (req, res) => userController.signupManager(req,res));

router.post("/login", (req, res) => userController.loginUsers(req, res));
router.post("/logout", (req, res) => userController.logoutUser(req, res));

export default router;
