import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { playerProfileController, playerTeamController } from "presentation/composition";
import { playerTournamentController } from "presentation/composition/player/tournaments";


const router = Router();
const upload = multer();

router.put("/:playerId/profile", upload.single("file"), expressFileUpdateHandler(playerProfileController.updateProfile));

router.put('/:playerId/profile/sports', expressAdapter(playerProfileController.updatePlayerSportsFields));

router.get('/:playerId/profile', expressAdapter(playerProfileController.getProfile));

router.get('/teams', expressAdapter(playerTeamController.getAllTeams))

router.get('/teams/:playerId/:status', expressAdapter(playerTeamController.getMyTeams))

router.get('/teams/:playerId', expressAdapter(playerTeamController.getAllMyTeams))

router.post('/team/:playerId/invite/status', expressAdapter(playerTeamController.updateStatus))

router.get('/team/:teamId/details', expressAdapter(playerTeamController.getTeamDetails))

router.post('/:teamId/join', expressAdapter(playerTeamController.joinTeams))

router.get('/tournaments', expressAdapter(playerTournamentController.getplayerTournaments))

export default router;