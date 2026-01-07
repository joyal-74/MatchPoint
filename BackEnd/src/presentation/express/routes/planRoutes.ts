import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { PlanController } from 'presentation/http/controllers/admin/PlanController';

import { container } from "tsyringe";

const router = Router();

const planController = container.resolve(PlanController)

router.get("/plans", expressAdapter(planController.getAll));
router.post("/plan", expressAdapter(planController.create));
router.put("/plan", expressAdapter(planController.update));
router.delete("/plan/:id", expressAdapter(planController.delete));

export default router;