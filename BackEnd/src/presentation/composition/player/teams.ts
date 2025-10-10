import { TeamsController } from 'presentation/http/controllers/player/TeamsController';
import { FetchAllTeams } from 'app/usecases/player/FetchPlayerTeams';
import { JoinTeamUseCase } from 'app/usecases/player/JoinTeams';
import { GetMyTeamsUseCase } from 'app/usecases/player/GetMyTeams';
import { GetMyTeamDetails } from 'app/usecases/player/GetMyTeamDetails';
import { teamRepository, playerRepository } from '../shared/repositories';
import { logger } from '../shared/providers';

// Use cases
const fetchAllTeamsUC = new FetchAllTeams(teamRepository, logger);
const joinTeamUC = new JoinTeamUseCase(teamRepository, playerRepository, logger);
const getMyTeamsUC = new GetMyTeamsUseCase(teamRepository, logger);
const getMyTeamDetailsUC = new GetMyTeamDetails(teamRepository, logger);

// Controller
export const playerTeamController = new TeamsController(
    fetchAllTeamsUC,
    joinTeamUC,
    getMyTeamsUC,
    getMyTeamDetailsUC,
    logger
);
