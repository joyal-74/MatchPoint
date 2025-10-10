import { AddNewTeamUseCase } from "app/usecases/manager/teams/AddNewTeam";
import { EditTeamUseCase } from "app/usecases/manager/teams/EditTeam";
import { SoftDeleteTeam } from "app/usecases/manager/teams/ChangeTeamStatus";
import { GetAllTeamUseCase } from "app/usecases/manager/teams/GetAllTeamsUseCase";
import { ChangePlayerStatusUseCase } from "app/usecases/manager/teams/ChangePlayerStatus";
import { TeamController } from "presentation/http/controllers/manager/TeamController";
import { ImageKitFileStorage } from "infra/providers/ImageKitFileStorage";
import { WinstonLogger } from "infra/providers/WinstonLogger";
import { TeamIdGenerator } from "infra/providers/IdGenerator";
import { teamRepository } from "presentation/composition/shared/repositories";


const logger = new WinstonLogger();
const imageKitfileProvider = new ImageKitFileStorage();
const teamId = new TeamIdGenerator();

const addNewTeam = new AddNewTeamUseCase(teamRepository, teamId, imageKitfileProvider, logger);
const editTeam = new EditTeamUseCase(teamRepository, imageKitfileProvider, logger);
const deleteTeam = new SoftDeleteTeam(teamRepository, logger);
const getallTeams = new GetAllTeamUseCase(teamRepository, logger);
const changeTeamStatus = new ChangePlayerStatusUseCase(teamRepository);

export const teamManagementController = new TeamController(
    addNewTeam,
    editTeam,
    deleteTeam,
    getallTeams,
    changeTeamStatus,
    logger
);
