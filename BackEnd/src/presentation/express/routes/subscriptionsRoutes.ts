import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { subscriptionController } from "presentation/composition/shared/subscriptions";


const router = Router();

router.get("/roles/:role/:userId/plans", expressAdapter(subscriptionController.getUserPlan));

router.post("/plan/order", expressAdapter(subscriptionController.initiateOrder));

router.post("/plan/verify", expressAdapter(subscriptionController.finalizeOrder));

export default router;