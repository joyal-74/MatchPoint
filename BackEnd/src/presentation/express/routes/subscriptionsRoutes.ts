import { container } from "tsyringe";
import { Router } from "express";
import { SubscriptionController } from "../../http/controllers/shared/SubscriptionPlanController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";



const router = Router();
const subscriptionController = container.resolve(SubscriptionController)

router.get("/roles/:role/:userId/plans", expressAdapter(subscriptionController.getUserPlan));

router.get("/:userId/plan", expressAdapter(subscriptionController.getUserPlanOnly));

router.post("/plan/order", expressAdapter(subscriptionController.initiateOrder));

router.put("/plan/update-plan", expressAdapter(subscriptionController.updatePlan));

router.post("/plan/verify", expressAdapter(subscriptionController.finalizeOrder));

export default router;