import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { subscriptionController } from "presentation/composition/shared/subscriptions";


const router = Router();

router.get("/roles/:role/:userId/plans", expressAdapter(subscriptionController.getUserPlan));

router.patch("/users/:userId/plan", expressAdapter(subscriptionController.updateUserPlan));

export default router;