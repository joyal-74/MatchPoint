import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { teamManagementController, tournamentManagementController, managerProfileController } from "presentation/container/container";

const router = Router();
const upload = multer();

router.put("/:managerId", upload.single("file"), expressFileUpdateHandler(managerProfileController.updateProfile));

router.get('/:managerId', expressAdapter(managerProfileController.getProfile));

router.post('/teams/change', expressAdapter(teamManagementController.changePlayerStatus));

router.get('/teams/:managerId', expressAdapter(teamManagementController.getAllTeams));

router.patch('/team/:teamId', expressAdapter(teamManagementController.deleteTeam));

router.post("/team", upload.single("logo"), expressFileUpdateHandler(teamManagementController.addNewTeam));

router.put("/team/:teamId", upload.single("logo"), expressFileUpdateHandler(teamManagementController.editTeam));

router.post("/tournament", expressAdapter(tournamentManagementController.addNewTournament));

router.put("/tournament/:managerId", expressAdapter(tournamentManagementController.editTournament));

router.get("/tournament/:managerId", expressAdapter(tournamentManagementController.getMyTournaments));

router.patch("/tournament/:tournamentId", expressAdapter(tournamentManagementController.cancelTournament));

router.get("/tournament/:tournamentId/details", expressAdapter(tournamentManagementController.tournamentDetails));

router.get("/tournament/explore/:managerId", expressAdapter(tournamentManagementController.getExploreTournaments));

router.post("/tournament/:tournamentId/payment", expressAdapter(tournamentManagementController.entryFeePayment));

router.post("/registration/:registrationId/status", expressAdapter(tournamentManagementController.updateTounamentTeam));

router.get("/tournament/:tournamentId/teams", expressAdapter(tournamentManagementController.getTournamentTeams));

export default router;