import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { playerProfileController, playerTeamController } from "presentation/composition";


const router = Router();
const upload = multer();

router.put("/:playerId", upload.single("file"), expressFileUpdateHandler(playerProfileController.updateProfile));

router.get('/:managerId', expressAdapter(playerProfileController.getProfile));

router.get('/teams', expressAdapter(playerTeamController.getAllTeams))

router.get('/teams/:playerId', expressAdapter(playerTeamController.getMyTeams))

router.get('/teams/:teamId/details', expressAdapter(playerTeamController.getTeamDetails))

router.post('/:teamId/join', expressAdapter(playerTeamController.joinTeams))

export default router;