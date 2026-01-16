import { Router } from "express";
import multer from "multer";
import { expressAdapter } from "presentation/adaptors/ExpressAdaptor";
import { expressFileUpdateHandler } from "presentation/adaptors/ExpressFileAdaptor";
import { container } from "tsyringe";
import { ProfileController } from "presentation/http/controllers/manager/ProfileController";
import { TeamController } from "presentation/http/controllers/manager/TeamController";
import { TournamentController } from "presentation/http/controllers/manager/TournamentController";
import { MatchController } from "presentation/http/controllers/manager/MatchController";
import { FinancialsController } from "presentation/http/controllers/manager/FinancialsController";

const router = Router();
const upload = multer();

const managerProfileController = container.resolve(ProfileController)
const teamManagementController = container.resolve(TeamController)
const tournamentManagementController = container.resolve(TournamentController)
const matchController = container.resolve(MatchController)
const financialsController = container.resolve(FinancialsController)


router.put("/:managerId", upload.single("file"), expressFileUpdateHandler(managerProfileController.updateProfile));
router.get('/:managerId', expressAdapter(managerProfileController.getProfile));

router.post('/teams/change', expressAdapter(teamManagementController.changePlayerStatus));
router.get('/teams/:managerId', expressAdapter(teamManagementController.getAllTeams));
router.get('/team/:teamId/details', expressAdapter(teamManagementController.getTeamDetails));
router.post('/team/:playerId/approve', expressAdapter(teamManagementController.approvePlayertoTeam));
router.post('/team/:playerId/reject', expressAdapter(teamManagementController.rejectPlayerfromTeam));
router.post('/team/:playerId/remove', expressAdapter(teamManagementController.removePlayers));
router.post('/team/:playerId/add', expressAdapter(teamManagementController.addPlayer));
router.patch('/team/:playerId/swap', expressAdapter(teamManagementController.swapPlayers));
router.patch('/team/:teamId', expressAdapter(teamManagementController.deleteTeam));
router.post("/team", upload.single("logo"), expressFileUpdateHandler(teamManagementController.addNewTeam));
router.put("/team/:teamId", upload.single("logo"), expressFileUpdateHandler(teamManagementController.editTeam));

router.post("/tournament", upload.single("banner"), expressFileUpdateHandler(tournamentManagementController.addNewTournament));
router.put("/tournament/:managerId", upload.single("banner"), expressFileUpdateHandler(tournamentManagementController.editTournament));
router.get("/tournament/:managerId", expressAdapter(tournamentManagementController.getMyTournaments));
router.get("/tournament/:managerId/analytics", expressAdapter(tournamentManagementController.getDashboardAnalytics));
router.patch("/tournament/:tournamentId", expressAdapter(tournamentManagementController.cancelTournament));
router.get("/tournament/:tournamentId/details", expressAdapter(tournamentManagementController.tournamentDetails));
router.get("/tournament/explore/:managerId", expressAdapter(tournamentManagementController.getExploreTournaments));
router.post("/tournament/:tournamentId/payment", expressAdapter(tournamentManagementController.entryFeePayment));

router.post("/registration/:registrationId/status", expressAdapter(tournamentManagementController.updateTounamentTeam));
router.get("/tournament/:tournamentId/teams", expressAdapter(tournamentManagementController.getTournamentTeams));
router.get("/tournament/:tournamentId/available-players", expressAdapter(teamManagementController.availablePlayers));

router.post("/tournament/start", expressAdapter(tournamentManagementController.startTournament));
router.post("/tournament/:tournamentId/matches", expressAdapter(tournamentManagementController.createTournamentMatches));
router.post("/tournament/:tournamentId/matches", expressAdapter(tournamentManagementController.createTournamentMatches));
router.get("/tournament/:tournamentId/matches", expressAdapter(tournamentManagementController.getTournamentMatches));
router.get("/tournament/:tournamentId/fixture", expressAdapter(tournamentManagementController.getTournamentFixtures));
router.post("/tournament/:tournamentId/fixture", expressAdapter(tournamentManagementController.createTournamentFixtures));

router.get("/tournament/:tournamentId/leaderboard", expressAdapter(tournamentManagementController.getTournamentLeaderBoard));

router.get("/tournament/matches/:matchId/details", expressAdapter(matchController.getMatchDetails));
router.get("/tournament/matches/:matchId/livescore", expressAdapter(matchController.getLiveScore));
router.post("/tournament/matches/:matchId/save", expressAdapter(matchController.saveMatchData));
router.post("/tournament/matches/start", expressAdapter(matchController.startMatchData));

router.get("/financials/:managerId", expressAdapter(financialsController.getReport));



export default router;