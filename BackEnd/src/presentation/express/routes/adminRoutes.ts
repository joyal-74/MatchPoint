import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { usersManagementController } from "presentation/composition";
import { adminOnly } from "presentation/composition/shared/middlewares";

const router = Router();


router.get("/viewers", adminOnly, expressAdapter(usersManagementController.getAllViewers));
router.get("/viewers/:id", adminOnly, expressAdapter(usersManagementController.fetchViewerDetails));
router.get("/managers", adminOnly, expressAdapter(usersManagementController.getAllManagers));
router.get("/managers/:id", adminOnly, expressAdapter(usersManagementController.fetchManagerDetails));
router.get("/players", adminOnly, expressAdapter(usersManagementController.getAllPlayers));
router.get("/players/:id", adminOnly, expressAdapter(usersManagementController.fetchPlayerDetails));

router.patch( "/:role/:userId/status", adminOnly, expressAdapter(usersManagementController.changeUserStatus));

export default router;