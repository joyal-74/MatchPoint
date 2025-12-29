import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { dashboardController, tournamentController, usersManagementController } from "presentation/composition";
import { adminOnly } from "presentation/composition/shared/middlewares";

const router = Router();


router.get("/dashboard/stats", adminOnly, expressAdapter(dashboardController.getDashboard));

router.get("/viewers", adminOnly, expressAdapter(usersManagementController.getAllViewers));
router.get("/viewers/:id", adminOnly, expressAdapter(usersManagementController.fetchViewerDetails));
router.get("/managers", adminOnly, expressAdapter(usersManagementController.getAllManagers));
router.get("/managers/:id", adminOnly, expressAdapter(usersManagementController.fetchManagerDetails));
router.get("/players", adminOnly, expressAdapter(usersManagementController.getAllPlayers));
router.get("/players/:id", adminOnly, expressAdapter(usersManagementController.fetchPlayerDetails));

router.get("/teams", adminOnly, expressAdapter(tournamentController.getAllTeams));
router.get("/team/:id", adminOnly, expressAdapter(tournamentController.getTeamDetails));
router.patch("/team/:teamId/status", adminOnly, expressAdapter(tournamentController.changeTeamStatus));
router.patch("/team/:teamId/toggle", adminOnly, expressAdapter(tournamentController.ChangeTeamDetailStatus));
router.get("/tournaments", adminOnly, expressAdapter(tournamentController.getAllTournaments));

router.patch( "/:role/:userId/status", adminOnly, expressAdapter(usersManagementController.changeUserStatus));
router.patch( "/user/:userId/blockStatus", adminOnly, expressAdapter(usersManagementController.changeUserBlockStatus));

export default router;