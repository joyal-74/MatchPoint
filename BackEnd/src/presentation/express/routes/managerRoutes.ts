import { Router } from "express";
import multer from "multer";
import { container } from "tsyringe";
import { ProfileController } from "../../http/controllers/manager/ProfileController.js";
import { TeamController } from "../../http/controllers/manager/TeamController.js";
import { TournamentController } from "../../http/controllers/manager/TournamentController.js";
import { MatchController } from "../../http/controllers/manager/MatchController.js";
import { FinancialsController } from "../../http/controllers/manager/FinancialsController.js";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { expressFileUpdateHandler } from "../../adaptors/ExpressFileAdaptor.js";
import { managerOnly } from "../middlewares/index.js";


const router = Router();
const upload = multer();

const managerProfileController = container.resolve(ProfileController)
const teamManagementController = container.resolve(TeamController)
const tournamentManagementController = container.resolve(TournamentController)
const matchController = container.resolve(MatchController)
const financialsController = container.resolve(FinancialsController)


router.get("/matches", managerOnly, expressAdapter(matchController.getAllMatches));

router.put("/:managerId", managerOnly, upload.single("file"), expressFileUpdateHandler(managerProfileController.updateProfile));
router.get('/:managerId', managerOnly, expressAdapter(managerProfileController.getProfile));

router.post('/teams/change', managerOnly, expressAdapter(teamManagementController.changePlayerStatus));
router.get('/teams/:managerId', managerOnly, expressAdapter(teamManagementController.getAllTeams));
router.get('/team/:teamId/details', managerOnly, expressAdapter(teamManagementController.getTeamDetails));
router.post('/team/:playerId/approve', managerOnly, expressAdapter(teamManagementController.approvePlayertoTeam));
router.post('/team/:playerId/reject', managerOnly, expressAdapter(teamManagementController.rejectPlayerfromTeam));
router.post('/team/:playerId/remove', managerOnly, expressAdapter(teamManagementController.removePlayers));
router.post('/team/:playerId/add', managerOnly, expressAdapter(teamManagementController.addPlayer));
router.patch('/team/:playerId/swap', managerOnly, expressAdapter(teamManagementController.swapPlayers));
router.patch('/team/:teamId', managerOnly, expressAdapter(teamManagementController.deleteTeam));
router.post("/team", upload.single("logo"), managerOnly, expressFileUpdateHandler(teamManagementController.addNewTeam));
router.put("/team/:teamId", upload.single("logo"), managerOnly, expressFileUpdateHandler(teamManagementController.editTeam));

router.post("/tournament", upload.single("banner"), managerOnly, expressFileUpdateHandler(tournamentManagementController.addNewTournament));
router.put("/tournament/:managerId", upload.single("banner"), managerOnly, expressFileUpdateHandler(tournamentManagementController.editTournament));
router.get("/tournament/:managerId", managerOnly, expressAdapter(tournamentManagementController.getMyTournaments));
router.get("/tournament/:managerId/analytics", managerOnly, expressAdapter(tournamentManagementController.getDashboardAnalytics));
router.patch("/tournament/:tournamentId", managerOnly, expressAdapter(tournamentManagementController.cancelTournament));
router.get("/tournament/:tournamentId/details", managerOnly, expressAdapter(tournamentManagementController.tournamentDetails));
router.get("/tournament/explore/:managerId", managerOnly, expressAdapter(tournamentManagementController.getExploreTournaments));
router.post("/tournament/:tournamentId/payment", managerOnly, expressAdapter(tournamentManagementController.entryFeePayment));

router.post("/registration/:registrationId/status", managerOnly, expressAdapter(tournamentManagementController.updateTounamentTeam));
router.get("/tournament/:tournamentId/teams", managerOnly, expressAdapter(tournamentManagementController.getTournamentTeams));
router.get("/tournament/:tournamentId/available-players", managerOnly, expressAdapter(teamManagementController.availablePlayers));

router.post("/tournament/start", managerOnly, expressAdapter(tournamentManagementController.startTournament));
router.post("/tournament/:tournamentId/matches", managerOnly, expressAdapter(tournamentManagementController.createTournamentMatches));
router.post("/tournament/:tournamentId/matches", managerOnly, expressAdapter(tournamentManagementController.createTournamentMatches));
router.get("/tournament/:tournamentId/matches", managerOnly, expressAdapter(tournamentManagementController.getTournamentMatches));
router.get("/tournament/:tournamentId/points-table", managerOnly, expressAdapter(tournamentManagementController.getPointsTable));
router.get("/tournament/:tournamentId/fixture", managerOnly, expressAdapter(tournamentManagementController.getTournamentFixtures));
router.post("/tournament/:tournamentId/fixture", managerOnly, expressAdapter(tournamentManagementController.createTournamentFixtures));

router.get("/tournament/:tournamentId/leaderboard", managerOnly, expressAdapter(tournamentManagementController.getTournamentLeaderBoard));
router.get("/tournament/:tournamentId/results", managerOnly, expressAdapter(tournamentManagementController.getTournamentMatchResults));

router.get("/tournament/matches/:matchId/details", managerOnly, expressAdapter(matchController.getMatchDetails));
router.get("/tournament/matches/:matchId/livescore", managerOnly, expressAdapter(matchController.getLiveScore));
router.post("/tournament/matches/:matchId/save", managerOnly, expressAdapter(matchController.saveMatchData));
router.post("/tournament/matches/start", managerOnly, expressAdapter(matchController.startMatchData));

router.get("/financials/:managerId", managerOnly, expressAdapter(financialsController.getReport));


export default router;
