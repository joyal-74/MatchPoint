import { UsersManagementController } from 'presentation/http/controllers/admin/UsersManagementController';
import { logger } from '../shared/providers';
import { managerRepository, playerRepository, userRepository } from 'presentation/composition/shared/repositories';
import { GetAllViewers } from 'app/usecases/admin/GetAllViewers';
import { GetAllManagers } from 'app/usecases/admin/GetAllManagers';
import { GetAllPlayers } from 'app/usecases/admin/GetAllPlayers';
import { ChangeUserStatus } from 'app/usecases/admin/ChangeUserStatus';
import { GetManagerDetails } from 'app/usecases/admin/GetManagerDetails';
import { GetPlayerDetails } from 'app/usecases/admin/GetPlayerDetails';
import { GetViewerDetails } from 'app/usecases/admin/GetViewerDetails';

const getAllViewersUC = new GetAllViewers(userRepository, logger);
const getAllManagersUC = new GetAllManagers(userRepository, logger);
const getAllPlayersUC = new GetAllPlayers(userRepository, logger);
const changeUserStatusUC = new ChangeUserStatus(userRepository, logger);
const getManagerDetailsUC = new GetManagerDetails(managerRepository, logger);
const getPlayerDetailsUC = new GetPlayerDetails(playerRepository, logger);
const getViewerDetailsUC = new GetViewerDetails(userRepository, logger);

export const usersManagementController = new UsersManagementController(
    getAllManagersUC,
    getAllPlayersUC,
    getAllViewersUC,
    changeUserStatusUC,
    getManagerDetailsUC,
    getPlayerDetailsUC,
    getViewerDetailsUC
);