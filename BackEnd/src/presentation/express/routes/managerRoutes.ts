import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { teamManagementController, tournamentManagementController, updateManagerProfileController } from "presentation/container/container";

const router = Router();
const upload = multer();

router.put("/profile", upload.single("logo"), expressFileUpdateHandler(updateManagerProfileController.updateProfile));

router.post('/teams/change', expressAdapter(teamManagementController.changePlayerStatus));

router.get('/teams/:managerId', expressAdapter(teamManagementController.getAllTeams));

router.patch('/team/:teamId', expressAdapter(teamManagementController.deleteTeam));

router.post("/team", upload.single("logo"), expressFileUpdateHandler(teamManagementController.addNewTeam));

router.put("/team/:teamId", upload.single("logo"), expressFileUpdateHandler(teamManagementController.editTeam));

router.post("/tournament", expressAdapter(tournamentManagementController.addNewTournament));

router.put("/tournament/:managerId", expressAdapter(tournamentManagementController.editTournament));

router.get("/tournament/:managerId", expressAdapter(tournamentManagementController.getMyTournaments));

router.get("/tournament/explore/:managerId", expressAdapter(tournamentManagementController.getExploreTournaments));

export default router;