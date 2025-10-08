import { Router } from "express";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { playerTeamController } from "presentation/container/container";


const router = Router();

router.get('/teams', expressAdapter(playerTeamController.getAllTeams))
router.get('/teams/:playerId', expressAdapter(playerTeamController.getMyTeams))
router.get('/teams/:teamId/details', expressAdapter(playerTeamController.getTeamDetails))
router.post('/:teamId/join', expressAdapter(playerTeamController.joinTeams))

export default router;