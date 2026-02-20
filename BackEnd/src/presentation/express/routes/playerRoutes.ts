import { Router } from "express";
import multer from "multer";


import { container } from "tsyringe";
import { PlayerProfileController } from "../../http/controllers/player/ProfileController.js";
import { TeamsController } from "../../http/controllers/player/TeamsController.js";
import { TournamentsController } from "../../http/controllers/player/TournamentsController.js";
import { expressFileUpdateHandler } from "../../adaptors/ExpressFileAdaptor.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { playerOnly } from "../middlewares/index.js";

const router = Router();
const upload = multer();

const playerProfileController = container.resolve(PlayerProfileController)
const playerTeamController = container.resolve(TeamsController)
const playerTournamentController = container.resolve(TournamentsController)

router.put("/:playerId/profile", playerOnly, upload.single("file"), expressFileUpdateHandler(playerProfileController.updateProfile));

router.get("/:userId/stats",playerOnly, expressAdapter(playerProfileController.getPlayerStats));

router.put('/:playerId/profile/sports',playerOnly, expressAdapter(playerProfileController.updatePlayerSportsFields));

router.get('/:playerId/profile',playerOnly, expressAdapter(playerProfileController.getProfile));

router.get('/teams',playerOnly, expressAdapter(playerTeamController.getAllTeams))

router.get('/teams/:playerId',playerOnly, expressAdapter(playerTeamController.getMyTeams))

router.post('/team/:playerId/invite/status',playerOnly, expressAdapter(playerTeamController.updateStatus))

router.get('/team/:teamId/details',playerOnly, expressAdapter(playerTeamController.getTeamDetails))

router.post('/:teamId/join',playerOnly, expressAdapter(playerTeamController.joinTeams))

router.post('/:teamId/leave',playerOnly, expressAdapter(playerTeamController.playerLeaveTeam))

router.get('/tournaments',playerOnly, expressAdapter(playerTournamentController.getplayerTournaments))

router.post('/tournaments/details',playerOnly, expressAdapter(playerTournamentController.getPlayerTournamentDetails))

router.post('/tournaments/details/matches',playerOnly, expressAdapter(playerTournamentController.getplayerTournamentMatches))

router.post('/tournaments/details/pointstable',playerOnly, expressAdapter(playerTournamentController.getTournamentPointsTable))

router.post('/tournaments/details/stats',playerOnly, expressAdapter(playerTournamentController.getTournamentPointsTable))

router.get('/tournament/matches',playerOnly, expressAdapter(playerTournamentController.getplayerMatches))

export default router;
