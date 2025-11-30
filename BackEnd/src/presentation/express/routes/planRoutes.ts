import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { planController } from "presentation/composition";

const router = Router();

router.get("/plans", expressAdapter(planController.getAll));
router.post("/plan", expressAdapter(planController.create));
router.delete("/plan/:id", expressAdapter(planController.delete));

export default router;