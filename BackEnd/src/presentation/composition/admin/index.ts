import { UsersManagementController } from 'presentation/http/controllers/admin/UsersManagementController';

import { logger } from '../shared/providers';
import { userRepository } from 'presentation/composition/shared/repositories';
import { GetAllViewers } from 'app/usecases/admin/GetAllViewers';
import { GetAllManagers } from 'app/usecases/admin/GetAllManagers';
import { GetAllPlayers } from 'app/usecases/admin/GetAllPlayers';
import { ChangeUserStatus } from 'app/usecases/admin/ChangeUserStatus';

const getAllViewersUC = new GetAllViewers(userRepository, logger);
const getAllManagersUC = new GetAllManagers(userRepository, logger);
const getAllPlayersUC = new GetAllPlayers(userRepository, logger);
const changeUserStatusUC = new ChangeUserStatus(userRepository, logger);

export const usersManagementController = new UsersManagementController(
    getAllManagersUC,
    getAllPlayersUC,
    getAllViewersUC,
    changeUserStatusUC
);