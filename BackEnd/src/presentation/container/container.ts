import { UserRepositoryMongo } from '../../infra/repositories/mongo/UserRepositoryMongo';
import { AdminRepositoryMongo } from '../../infra/repositories/mongo/AdminRepositoryMongo';
import { OtpRepositoryMongo } from '../../infra/repositories/mongo/OtpRepositoryMongo';
import { ManagerRepositoryMongo } from 'infra/repositories/mongo/ManagerRepositoryMongo';
import { PlayerRepositoryMongo } from '../../infra/repositories/mongo/PlayerRepositoryMongo';
import { JWTService } from '../../infra/services/jwtServices';
import { NodeMailerService } from '../../infra/services/NodeMailerService';
import { NodeOtpGenerator } from '../../infra/providers/NodeOtpGenerator';
import { BcryptPasswordHasher } from '../../infra/providers/BcryptPasswordHasher';
import { WinstonLogger } from "infra/providers/WinstonLogger";
import { SignupViewer } from '../../app/usecases/Authentication/SignupViewer';
import { SignupPlayer } from '../../app/usecases/Authentication/SignupPlayer';
import { SignupManager } from '../../app/usecases/Authentication/SignUpManager';
import { LogoutUser } from 'app/usecases/Authentication/Logout';
import { LoginAdmin } from '../../app/usecases/Authentication/LoginAdmin';
import { LoginUser } from '../../app/usecases/Authentication/LoginUser';
import { RefreshToken } from '../../app/usecases/Authentication/RefreshToken';
import { VerifyOtp } from 'app/usecases/Authentication/VerifyOtp';
import { ResetPassword } from 'app/usecases/Authentication/ResetPassword';
import { ForgotPassword } from 'app/usecases/Authentication/ForgotPassword';
import { ResendOtp } from 'app/usecases/Authentication/ResendOtp';
import { GetAllViewers } from 'app/usecases/admin/GetAllViewers';
import { GetAllManagers } from 'app/usecases/admin/GetAllManagers';
import { GetAllPlayers } from 'app/usecases/admin/GetAllPlayers';
import { deleteUnverifiedUsersCron } from 'infra/cron/deleteUnverifiedUsersCron';
import { NodeCronScheduler } from 'infra/services/NodeCronScheduler';
import { ImageKitFileStorage } from 'infra/providers/ImageKitFileStorage';
import { ProfileController } from 'presentation/http/controllers/manager/ProfileController';
import { UpdateManagerProfile } from 'app/usecases/manager/UpdateManagerProfile';
import { ChangeUserStatus } from 'app/usecases/admin/ChangeUserStatus';
import { verifyTokenMiddleware } from 'presentation/express/middlewares/verifyTokenMiddleware';
import { AuthController } from 'presentation/http/controllers/authentication/AuthController';
import { UsersManagementController } from 'presentation/http/controllers/admin/UsersManagementController';
import { ManagerIdGenerator, PlayerIdGenerator, TeamIdGenerator, UserIdGenerator } from 'infra/providers/IdGenerator';
import { TeamController } from 'presentation/http/controllers/manager/TeamController';
import { AddNewTeamUseCase } from 'app/usecases/manager/teams/AddNewTeam';
import { TeamRepositoryMongo } from 'infra/repositories/mongo/TeamRepositoryMongo';
import { GetAllTeamsUseCase } from 'app/usecases/manager/GetTeamList';
import { ChangePlayerStatusUseCase } from 'app/usecases/manager/teams/ChangePlayerStatus';
import { EditTeamUseCase } from 'app/usecases/manager/teams/EditTeam';
import { SoftDeleteTeam } from 'app/usecases/manager/teams/ChangeTeamStatus';

// Repositories
const userRepository = new UserRepositoryMongo();
const adminRepository = new AdminRepositoryMongo();
const playerRepository = new PlayerRepositoryMongo();
const managerRepository = new ManagerRepositoryMongo();
const teamRepository = new TeamRepositoryMongo();

// Infra Services
const jwtService = new JWTService();
const mailService = new NodeMailerService();
const otpGenerator = new NodeOtpGenerator();
const passwordHasher = new BcryptPasswordHasher();
const otpService = new OtpRepositoryMongo();
const imageKitfileProvider = new ImageKitFileStorage();
const logger = new WinstonLogger();
const teamId = new TeamIdGenerator();
const userId = new UserIdGenerator();
const playerId = new PlayerIdGenerator();
const managerId = new ManagerIdGenerator();

// Use Cases (Authentication)
const loginAdmin = new LoginAdmin(adminRepository, jwtService, passwordHasher, logger);
const loginUser = new LoginUser(userRepository, jwtService, passwordHasher, logger);
const refreshUser = new RefreshToken(userRepository, adminRepository, jwtService, logger);
const viewerRegister = new SignupViewer(userRepository, otpService, mailService, passwordHasher, otpGenerator, userId);
const managerRegister = new SignupManager(userRepository, managerRepository, otpService, mailService, passwordHasher, otpGenerator, managerId);
const playerRegister = new SignupPlayer(userRepository, playerRepository, otpService, mailService, passwordHasher, otpGenerator, playerId);
const logout = new LogoutUser(userRepository, adminRepository, logger);
const verifyOtp = new VerifyOtp(userRepository, otpService);
const resendOtp = new ResendOtp(userRepository, otpService, mailService, otpGenerator);
const resetPassword = new ResetPassword(userRepository, otpService, passwordHasher);
const forgotPassword = new ForgotPassword(userRepository, otpService, mailService, otpGenerator);

// Use Cases (Admin)
const getAllViewers = new GetAllViewers(userRepository, logger);
const getAllManagers = new GetAllManagers(userRepository, logger);
const getAllPlayers = new GetAllPlayers(userRepository, logger);
const changeUserStatus = new ChangeUserStatus(userRepository, logger);

// use case (manager)
const updateManagerProfile = new UpdateManagerProfile(userRepository, imageKitfileProvider);
const addNewTeam = new AddNewTeamUseCase(teamRepository, teamId, imageKitfileProvider, logger);
const editTeam = new EditTeamUseCase(teamRepository, imageKitfileProvider, logger);
const deleteTeam = new SoftDeleteTeam(teamRepository, logger);
const getallTeams = new GetAllTeamsUseCase(teamRepository, logger);
const changeTeamStatus = new ChangePlayerStatusUseCase(teamRepository);


const scheduler = new NodeCronScheduler();

// Cron job wiring
deleteUnverifiedUsersCron(scheduler, userRepository, playerRepository, managerRepository, logger);

// Controllers
export const authController = new AuthController(loginUser, loginAdmin, logout, viewerRegister,
    playerRegister, managerRegister, refreshUser, forgotPassword, verifyOtp, resendOtp, resetPassword);

export const usersManagementController = new UsersManagementController(getAllManagers, getAllPlayers, getAllViewers, changeUserStatus);

export const teamManagementController = new TeamController(addNewTeam, editTeam, deleteTeam, getallTeams, changeTeamStatus, logger);

export const updateManagerProfileController = new ProfileController(updateManagerProfile);

// role specific access
export const adminOnly = verifyTokenMiddleware(jwtService, ["admin"]);
export const playerOnly = verifyTokenMiddleware(jwtService, ["player"]);
export const managerOnly = verifyTokenMiddleware(jwtService, ["manager"]);