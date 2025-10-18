import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { playerProfileController, playerTeamController } from "presentation/composition";


const router = Router();
const upload = multer();

router.put("/:playerId/profile", upload.single("file"), expressFileUpdateHandler(playerProfileController.updateProfile));

router.put('/:playerId/profile/sports', expressAdapter(playerProfileController.updatePlayerSportsFields));

router.get('/:playerId/profile', expressAdapter(playerProfileController.getProfile));

router.get('/teams', expressAdapter(playerTeamController.getAllTeams))

router.get('/teams/:playerId/:status', expressAdapter(playerTeamController.getMyTeams))

router.get('/teams/:playerId', expressAdapter(playerTeamController.getAllMyTeams))

router.get('/team/:teamId/details', expressAdapter(playerTeamController.getTeamDetails))

router.post('/:teamId/join', expressAdapter(playerTeamController.joinTeams))

export default router;