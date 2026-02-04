import { Router } from "express";


import { container } from "tsyringe";
import { PlanController } from "../../http/controllers/admin/PlanController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";

const router = Router();

const planController = container.resolve(PlanController)

router.get("/plans", expressAdapter(planController.getAll));
router.post("/plan", expressAdapter(planController.create));
router.put("/plan", expressAdapter(planController.update));
router.delete("/plan/:id", expressAdapter(planController.delete));

export default router;
