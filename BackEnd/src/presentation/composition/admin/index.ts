import { UsersManagementController } from 'presentation/http/controllers/admin/UsersManagementController';
import { logger } from '../shared/providers';
import { managerRepository, planRepository, playerRepository, userRepository } from 'presentation/composition/shared/repositories';
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

const getPlansUC = new GetPlansUseCase(planRepository);
const createPlansUC = new CreatePlanUseCase(planRepository);
const deletePlansUC = new DeletePlanUseCase(planRepository);

export const planController = new PlanController(
    getPlansUC,
    createPlansUC,
    deletePlansUC
);