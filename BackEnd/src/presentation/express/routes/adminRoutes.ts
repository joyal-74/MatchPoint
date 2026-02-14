import { Router } from "express";
import { DashboardController } from "../../http/controllers/admin/DashBoardController.js";
import { container } from "tsyringe";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { adminOnly } from "../middlewares/index.js";
import { TournamentManagementController } from "../../http/controllers/admin/TournamnetManagementController.js";
import { AdminTransactionController } from "../../http/controllers/admin/TransactionController.js";
import { UsersManagementController } from "../../http/controllers/admin/UsersManagementController.js";


const router = Router();

const dashboardController = container.resolve(DashboardController);
const tournamentController = container.resolve(TournamentManagementController);
const transactionController = container.resolve(AdminTransactionController);
const usersManagementController = container.resolve(UsersManagementController);

router.get("/dashboard/stats", adminOnly, expressAdapter(dashboardController.getDashboard));

router.get("/viewers", adminOnly, expressAdapter(usersManagementController.getAllViewers));
router.get("/viewers/:id", adminOnly, expressAdapter(usersManagementController.fetchViewerDetails));
router.get("/managers", adminOnly, expressAdapter(usersManagementController.getAllManagers));
router.get("/managers/:id", adminOnly, expressAdapter(usersManagementController.fetchManagerDetails));
router.get("/players", adminOnly, expressAdapter(usersManagementController.getAllPlayers));
router.get("/players/:id", adminOnly, expressAdapter(usersManagementController.fetchPlayerDetails));

router.get("/teams", adminOnly, expressAdapter(tournamentController.getAllTeams));
router.get("/team/:id", adminOnly, expressAdapter(tournamentController.getTeamDetails));
router.get("/tournament/:id", adminOnly, expressAdapter(tournamentController.getTournamentDetails));
router.patch("/team/:teamId/status", adminOnly, expressAdapter(tournamentController.changeTeamStatus));
router.patch("/team/:teamId/toggle", adminOnly, expressAdapter(tournamentController.ChangeTeamDetailStatus));
router.patch("/tournament/:tourId/status", adminOnly, expressAdapter(tournamentController.changeTournamentStatus));
router.patch("/tournament/:tourId/toggle", adminOnly, expressAdapter(tournamentController.ChangeTournamentDetailStatus));
router.get("/tournaments", adminOnly, expressAdapter(tournamentController.getAllTournaments));

router.get("/transactions", adminOnly, expressAdapter(transactionController.getTransactions));
router.get("/transactions/:id", adminOnly, expressAdapter(transactionController.getTransactionDetails));

router.patch( "/:role/:userId/status", adminOnly, expressAdapter(usersManagementController.changeUserStatus));
router.patch( "/user/:userId/blockStatus", adminOnly, expressAdapter(usersManagementController.changeUserBlockStatus));

export default router;
