import { TeamsController } from 'presentation/http/controllers/player/TeamsController';
import { FetchAllTeams } from 'app/usecases/player/FetchPlayerTeams';
import { JoinTeamUseCase } from 'app/usecases/player/JoinTeams';
import { GetMyTeamsUseCase } from 'app/usecases/player/GetMyTeams';
import { GetMyTeamDetails } from 'app/usecases/player/GetMyTeamDetails';
import { teamRepository, playerRepository, notificationRepository } from '../shared/repositories';
import { logger } from '../shared/providers';
import { GetAllMyTeamsUseCase } from 'app/usecases/player/GetAllMyTeams';
import { teamServices } from '../shared/services';
import { UpdatePlayerInviteStatus } from 'app/usecases/player/UpdatePlayerInviteStatus';

// Use cases
const fetchAllTeamsUC = new FetchAllTeams(teamRepository, logger);
const joinTeamUC = new JoinTeamUseCase(teamRepository, playerRepository, logger);
const getMyTeamsUC = new GetMyTeamsUseCase(teamRepository, logger);
const getAllMyTeamsUC = new GetAllMyTeamsUseCase(teamServices, logger);
const getMyTeamDetailsUC = new GetMyTeamDetails(teamRepository, logger);
const updateInviteStatusUC = new UpdatePlayerInviteStatus(teamRepository, notificationRepository);


// Controller
export const playerTeamController = new TeamsController(
    fetchAllTeamsUC,
    joinTeamUC,
    getMyTeamsUC,
    getAllMyTeamsUC,
    getMyTeamDetailsUC,
    updateInviteStatusUC,
    logger
);