import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import {
    changeUserStatusController,
    getAllManagerController,
    getAllPlayersController,
    getAllViewersController
} from "presentation/container/container";

import { adminOnly } from "presentation/container/container";


const router = Router();

router.patch("/:role/:userId/status", adminOnly, (req, res) => expressAdapter(req, res, changeUserStatusController));

router.get("/viewers", adminOnly, (req, res) => expressAdapter(req, res, getAllViewersController));

router.get("/managers", adminOnly, (req, res) => expressAdapter(req, res, getAllManagerController));

router.get("/players", adminOnly, (req, res) => expressAdapter(req, res, getAllPlayersController));


export default router;