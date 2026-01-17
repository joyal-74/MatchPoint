import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { PlayerProfileController } from 'presentation/http/controllers/player/ProfileController';
import { TeamsController } from 'presentation/http/controllers/player/TeamsController';
import { TournamentsController } from "presentation/http/controllers/player/TournamentsController";

import { container } from "tsyringe";

const router = Router();
const upload = multer();

const playerProfileController = container.resolve(PlayerProfileController)
const playerTeamController = container.resolve(TeamsController)
const playerTournamentController = container.resolve(TournamentsController)

router.put("/:playerId/profile", upload.single("file"), expressFileUpdateHandler(playerProfileController.updateProfile));

router.put('/:playerId/profile/sports', expressAdapter(playerProfileController.updatePlayerSportsFields));

router.get('/:playerId/profile', expressAdapter(playerProfileController.getProfile));

router.get('/teams', expressAdapter(playerTeamController.getAllTeams))

router.get('/teams/:playerId', expressAdapter(playerTeamController.getMyTeams))

router.post('/team/:playerId/invite/status', expressAdapter(playerTeamController.updateStatus))

router.get('/team/:teamId/details', expressAdapter(playerTeamController.getTeamDetails))

router.post('/:teamId/join', expressAdapter(playerTeamController.joinTeams))

router.get('/tournaments', expressAdapter(playerTournamentController.getplayerTournaments))

router.post('/tournaments/details', expressAdapter(playerTournamentController.getPlayerTournamentDetails))

router.post('/tournaments/details/matches', expressAdapter(playerTournamentController.getplayerTournamentMatches))

router.post('/tournaments/details/pointstable', expressAdapter(playerTournamentController.getTournamentPointsTable))

router.post('/tournaments/details/stats', expressAdapter(playerTournamentController.getTournamentPointsTable))

router.get('/tournament/matches', expressAdapter(playerTournamentController.getplayerMatches))

export default router;