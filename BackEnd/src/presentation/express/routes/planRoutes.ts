import { Router } from "express";


import { container } from "tsyringe";
import { PlanController } from "../../http/controllers/admin/PlanController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { adminOnly } from "../middlewares/index.js";

const router = Router();

const planController = container.resolve(PlanController)

router.get("/plans", adminOnly, expressAdapter(planController.getAll));
router.post("/plan", adminOnly, expressAdapter(planController.create));
router.put("/plan", adminOnly, expressAdapter(planController.update));
router.delete("/plan/:id", adminOnly, expressAdapter(planController.delete));

export default router;