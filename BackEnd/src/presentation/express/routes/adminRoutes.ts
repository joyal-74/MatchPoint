import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { usersManagementController, adminOnly } from "presentation/container/container";

const router = Router();

router.patch( "/:role/:userId/status", adminOnly, expressAdapter(usersManagementController.changeUserStatus));

router.get("/viewers", adminOnly, expressAdapter(usersManagementController.getAllViewers));

router.get("/managers", adminOnly, expressAdapter(usersManagementController.getAllManagers));

router.get("/players", adminOnly, expressAdapter(usersManagementController.getAllPlayers));

export default router;