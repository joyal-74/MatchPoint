import { UsersManagementController } from 'presentation/http/controllers/admin/UsersManagementController';
import { logger } from '../shared/providers';
import { dashboardRepo, managerRepository, planRepository, playerRepository, teamRepository, tournamentRepository, transactionRepo, userRepository } from 'presentation/composition/shared/repositories';
import { GetAllViewers } from 'app/usecases/admin/GetAllViewers';
import { GetAllManagers } from 'app/usecases/admin/GetAllManagers';
import { GetAllPlayers } from 'app/usecases/admin/GetAllPlayers';
import { GetManagerDetails } from 'app/usecases/admin/GetManagerDetails';
import { GetPlayerDetails } from 'app/usecases/admin/GetPlayerDetails';
import { GetViewerDetails } from 'app/usecases/admin/GetViewerDetails';
import { ChangeBlockUserStatus } from 'app/usecases/admin/ChangeBlockUserStatus';
import { ChangeUserStatus } from 'app/usecases/admin/ChangeUserStatus';
import { GetUsersByRole } from 'app/usecases/admin/GetUsersByRole';
import { UserManagementService } from 'infra/services/UserManagementService';
import { PlanController } from 'presentation/http/controllers/admin/PlanController';
import { GetPlansUseCase } from 'app/usecases/admin/GetPlansUseCase';
import { CreatePlanUseCase } from 'app/usecases/admin/CreatePlanUseCase';
import { DeletePlanUseCase } from 'app/usecases/admin/DeletePlanUseCase';
import { TournamentManagementController } from 'presentation/http/controllers/admin/TournamnetManagementController';
import { GetAllTeams } from 'app/usecases/admin/GetAllTeams';
import { GetAllTournaments } from 'app/usecases/admin/GetAllTournaments';
import { DashboardController } from 'presentation/http/controllers/admin/DashBoardController';
import { GetDashboardStatsUseCase } from 'app/usecases/admin/GetDashboardStatsUseCase';
import { UpdatePlanUseCase } from 'app/usecases/admin/UpdatePlanUseCase';
import { GetTeamDetails } from 'app/usecases/admin/GetTeamDetails';
import { ChangeTeamStatus } from 'app/usecases/admin/ChangeTeamStatus';
import { ChangeTeamDetailStatus } from 'app/usecases/admin/BlockTeamUsecase';
import { ChangeTournamentDetailStatus } from 'app/usecases/admin/BlockTournamentStatus';
import { GetTournamentDetails } from 'app/usecases/admin/GetTournamentDetails';
import { ChangeTournamentStatus } from 'app/usecases/admin/ChangeTournamentStatus';
import { AdminTransactionController } from 'presentation/http/controllers/admin/TransactionController';
import { GetAdminTransactions } from 'app/usecases/admin/GetAdminTransactions';
import { GetTransactionDetails } from 'app/usecases/admin/GetTransactionDetails';

const getAllViewersUC = new GetAllViewers(userRepository, logger);
const getAllManagersUC = new GetAllManagers(userRepository, logger);
const getAllPlayersUC = new GetAllPlayers(userRepository, logger);
const getManagerDetailsUC = new GetManagerDetails(managerRepository, logger);
const getPlayerDetailsUC = new GetPlayerDetails(playerRepository, logger);
const getViewerDetailsUC = new GetViewerDetails(userRepository, logger);

export const changeBlockStatusUC = new ChangeBlockUserStatus(userRepository, logger);
export const changeUserStatus = new ChangeUserStatus(userRepository, logger);
export const getUsersByRole = new GetUsersByRole(userRepository, logger);
export const userManagementSevices = new UserManagementService(changeUserStatus, changeBlockStatusUC, getUsersByRole)

export const usersManagementController = new UsersManagementController(
    getAllManagersUC,
    getAllPlayersUC,
    getAllViewersUC,
    userManagementSevices,
    getManagerDetailsUC,
    getPlayerDetailsUC,
    getViewerDetailsUC
);

const getTeamsUseCase = new GetAllTeams(teamRepository, logger);
const getTeamsDetailsUseCase = new GetTeamDetails(teamRepository, logger);
const getTournamentsUseCase = new GetAllTournaments(tournamentRepository, logger);
const changeTeamStatusUC = new ChangeTeamStatus(teamRepository, logger);
const changeTeamDetailStatusUC = new ChangeTeamDetailStatus(teamRepository, logger);
const changeTournamentDetailStatusUC = new ChangeTournamentDetailStatus(tournamentRepository, logger);
const getTournamentDetailsUseCase = new GetTournamentDetails(tournamentRepository, logger);
const changeTournamentStatusUseCase = new ChangeTournamentStatus(tournamentRepository, logger);

export const tournamentController = new TournamentManagementController(
    getTeamsUseCase,
    getTeamsDetailsUseCase,
    getTournamentsUseCase,
    getTournamentDetailsUseCase,
    changeTeamStatusUC,
    changeTeamDetailStatusUC,
    changeTournamentStatusUseCase,
    changeTournamentDetailStatusUC,
);

const getPlansUC = new GetPlansUseCase(planRepository);
const createPlansUC = new CreatePlanUseCase(planRepository, logger);
const deletePlansUC = new DeletePlanUseCase(planRepository);
const updatePlansUC = new UpdatePlanUseCase(planRepository, logger);

export const planController = new PlanController(
    getPlansUC,
    createPlansUC,
    deletePlansUC,
    updatePlansUC
);

const getDashboard = new GetDashboardStatsUseCase(dashboardRepo, logger)

export const dashboardController = new DashboardController(
    getDashboard
);

const getTransactionsUC = new GetAdminTransactions(transactionRepo);
const getTransactionDetailsUC = new GetTransactionDetails(transactionRepo);

export const transactionController = new AdminTransactionController(
    getTransactionsUC,
    getTransactionDetailsUC
);