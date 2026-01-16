import { container } from "tsyringe";
import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { SubscriptionController } from "presentation/http/controllers/shared/SubscriptionPlanController";


const router = Router();
const subscriptionController = container.resolve(SubscriptionController)

router.get("/roles/:role/:userId/plans", expressAdapter(subscriptionController.getUserPlan));

router.post("/plan/order", expressAdapter(subscriptionController.initiateOrder));

router.post("/plan/update-plan", expressAdapter(subscriptionController.updatePlan));

router.post("/plan/verify", expressAdapter(subscriptionController.finalizeOrder));

export default router;