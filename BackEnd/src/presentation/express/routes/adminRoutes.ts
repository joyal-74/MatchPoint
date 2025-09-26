import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { usersManagementController } from "presentation/container/container";

import { adminOnly } from "presentation/container/container";


const router = Router();

router.patch("/:role/:userId/status", adminOnly, (req, res) => expressAdapter(req, res, usersManagementController.changeUserStatus));

router.get("/viewers", adminOnly, (req, res) => expressAdapter(req, res, usersManagementController.getAllViewers));

router.get("/managers", adminOnly, (req, res) => expressAdapter(req, res, usersManagementController.getAllManagers));

router.get("/players", adminOnly, (req, res) => expressAdapter(req, res, usersManagementController.getAllPlayers));


export default router;