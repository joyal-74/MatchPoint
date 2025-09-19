import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor"; 
import { getAllManagerController, getAllPlayersController, getAllViewersController } from "presentation/container/container"; 

const router = Router();

router.get("/viewers", (req, res) => expressAdapter(req, res, getAllViewersController));

router.get("/managers", (req, res) => expressAdapter(req, res, getAllManagerController));

router.get("/players", (req, res) => expressAdapter(req, res, getAllPlayersController));

export default router;