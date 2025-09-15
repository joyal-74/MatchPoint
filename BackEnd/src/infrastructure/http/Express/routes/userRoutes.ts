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
import { MailService } from "@infra/services/email/MailService";
import { OtpRepositoryMongo } from "@infra/persistence/repositories/mongo/OtpRepositoryMongo";

const router = Router();

const userRepo = new UserRepositoryMongo();
const otpRepo = new OtpRepositoryMongo();
const playerRepo = new PlayerRepositoryMongo();
const careerStatsRepo = new CareerStatsRepositoryMongo();
const refreshTokenRepo = new RefreshTokenRepositoryMongo()

const mailService = new MailService();
const userService = new UserService(userRepo, otpRepo, mailService);
const playerService = new PlayerService(playerRepo);
const careerStatsService = new CareerStatsService(careerStatsRepo);
const authService = new AuthService(refreshTokenRepo);

const userController = new UserController(userService, playerService, careerStatsService, authService);


router.get("/admin/viewers", (req, res) => userController.getAllViewers(req, res));
router.get("/admin/players", (req, res) => userController.getAllPlayers(req, res));
router.get("/admin/managers", (req, res) => userController.getAllManagers(req, res));

router.post("/signup/viewer", (req, res) => userController.signupViewer(req, res));
router.post("/signup/player", (req, res) => userController.signupPlayer(req, res));
router.post("/signup/manager", (req, res) => userController.signupManager(req, res));

router.post("/verify-otp", (req, res) => userController.verifyOtp(req, res));
router.post("/resend-otp", (req, res) => userController.resendOtp(req, res));


router.post("/login", (req, res) => userController.loginUsers(req, res));
router.post("/logout", (req, res) => userController.logoutUser(req, res));

export default router;
