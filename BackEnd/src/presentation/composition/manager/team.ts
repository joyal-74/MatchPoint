import { AddNewTeamUseCase } from "app/usecases/manager/teams/AddNewTeam";
import { EditTeamUseCase } from "app/usecases/manager/teams/EditTeam";
import { SoftDeleteTeam } from "app/usecases/manager/teams/ChangeTeamStatus";
import { GetAllTeamUseCase } from "app/usecases/manager/teams/GetAllTeamsUseCase";
import { ChangePlayerStatusUseCase } from "app/usecases/manager/teams/ChangePlayerStatus";
import { TeamController } from "presentation/http/controllers/manager/TeamController";
import { ImageKitFileStorage } from "infra/providers/ImageKitFileStorage";
import { WinstonLogger } from "infra/providers/WinstonLogger";
import { TeamIdGenerator } from "infra/providers/IdGenerator";
import { chatRepository, managerRepository, notificationRepository, playerRepository, teamRepository } from "presentation/composition/shared/repositories";
import { GetMyTeamDetails } from "app/usecases/manager/GetMyTeamDetails";
import { ApprovePlayerUseCase } from "app/usecases/manager/teams/ApprovePlayer";
import { RejectPlayerUseCase } from "app/usecases/manager/teams/RejectPlayer";
import { SwapPlayers } from "app/usecases/manager/teams/SwapPlayers";
import { CreateChatForTeamUseCase } from "app/usecases/manager/teams/CreateChatForTeamUseCase";
import { TeamSetupService } from "infra/services/TeamSetupServices";
import { RemovePlayerUseCase } from "app/usecases/manager/teams/RemovePlayer";
import { GetAvailablePlayersService } from "infra/services/GetAvailablePlayersService";
import { AddPlayerToTeamUseCase } from "app/usecases/manager/teams/AddPlayerToTeamUseCase";


const logger = new WinstonLogger();
const imageKitfileProvider = new ImageKitFileStorage();
const teamId = new TeamIdGenerator();


export const addNewTeam = new AddNewTeamUseCase(teamRepository, managerRepository, teamId, imageKitfileProvider, logger);
export const createChatUC = new CreateChatForTeamUseCase(chatRepository)
export const teamSetupService = new TeamSetupService(addNewTeam, createChatUC);
const editTeam = new EditTeamUseCase(teamRepository, imageKitfileProvider, logger);
const deleteTeam = new SoftDeleteTeam(teamRepository, logger);
const getallTeams = new GetAllTeamUseCase(teamRepository, logger);
const getTeamDetails = new GetMyTeamDetails(teamRepository, logger);
const changeTeamStatus = new ChangePlayerStatusUseCase(teamRepository);
const approveToTeam = new ApprovePlayerUseCase(teamRepository);
const removeFromTeam = new RemovePlayerUseCase(teamRepository);
const rejectFromTeam = new RejectPlayerUseCase(teamRepository);
const swapPlayersUC = new SwapPlayers(teamRepository, logger);
const addPlayerUC = new AddPlayerToTeamUseCase(teamRepository, notificationRepository);
const getAvailablePlayerService = new GetAvailablePlayersService(teamRepository, playerRepository);

export const teamManagementController = new TeamController(
    teamSetupService,
    editTeam,
    deleteTeam,
    getallTeams,
    getTeamDetails,
    changeTeamStatus,
    approveToTeam,
    rejectFromTeam,
    swapPlayersUC,
    removeFromTeam,
    getAvailablePlayerService,
    addPlayerUC,
    logger
);
