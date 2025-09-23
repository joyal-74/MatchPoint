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
import { SignupViewer } from '../../app/usecases/authentication/SignupViewer';
import { SignupPlayer } from '../../app/usecases/authentication/SignupPlayer';
import { SignupManager } from '../../app/usecases/authentication/SignUpManager';
import { LogoutUser } from 'app/usecases/authentication/LogoutUser';
import { LogoutAdmin } from 'app/usecases/authentication/LogoutAdmin';
import { LoginAdmin } from '../../app/usecases/authentication/LoginAdmin';
import { LoginUser } from '../../app/usecases/authentication/LoginUser';
import { RefreshTokenUser } from '../../app/usecases/authentication/RefreshTokenUser';
import { RefreshTokenAdmin } from '../../app/usecases/authentication/RefreshTokenAdmin';
import { VerifyOtp } from 'app/usecases/authentication/VerifyOtp';
import { ResetPassword } from 'app/usecases/authentication/ResetPassword';
import { ForgotPassword } from 'app/usecases/authentication/ForgotPassword';
import { GetAllViewers } from 'app/usecases/admin/GetAllViewers';
import { GetAllManagers } from 'app/usecases/admin/GetAllManagers';
import { GetAllPlayers } from 'app/usecases/admin/GetAllPlayers';
import { PlayerSignupController } from '../http/controllers/authentication/PlayerSignupController';
import { AdminLoginController } from '../http/controllers/authentication/AdminLoginController';
import { UserLoginController } from '../http/controllers/authentication/UserLoginController';
import { AdminRefreshController } from '../http/controllers/authentication/AdminRefreshController';
import { UserRefreshController } from '../http/controllers/authentication/UserRefreshController';
import { ViewerSignupController } from '../http/controllers/authentication/ViewerSignupController';
import { ManagerSignupController } from '../http/controllers/authentication/ManagerSignupController';
import { UserLogoutController } from '../http/controllers/authentication/UserLogoutController';
import { AdminLogoutController } from 'presentation/http/controllers/authentication/AdminLogoutController';
import { ResetPasswordController } from 'presentation/http/controllers/authentication/ResetPasswordController';
import { VerifyOtpController } from 'presentation/http/controllers/authentication/VerifyOtpController';
import { ForgotPasswordController } from 'presentation/http/controllers/authentication/ForgotPasswordController';
import { GetAllViewersController } from 'presentation/http/controllers/admin/GetAllViewersController';
import { GetAllPlayersController } from 'presentation/http/controllers/admin/GetAllPlayersController';
import { GetAllManagersController } from 'presentation/http/controllers/admin/GetAllManagersController';
import { deleteUnverifiedUsersCron } from 'infra/cron/deleteUnverifiedUsersCron';
import { NodeCronScheduler } from 'infra/services/NodeCronScheduler';

// import { S3FileProvider } from 'infra/providers/S3FileStorage';
import { ImageKitFileStorage } from 'infra/providers/ImageKitFileStorage';
import { UpdateManagerProfileController } from 'presentation/http/controllers/manager/UpdateManagerProfileController';
import { UpdateManagerProfile } from 'app/usecases/manager/UpdateManagerProfile';
import { ChangeUserStatus } from 'app/usecases/admin/ChangeUserStatus';
import { ChangeUserStatusController } from 'presentation/http/controllers/admin/ChangeUserStatusController';


// Repositories
const userRepository = new UserRepositoryMongo();
const adminRepository = new AdminRepositoryMongo();
const playerRepository = new PlayerRepositoryMongo();
const managerRepository = new ManagerRepositoryMongo();

// Infra Services
const jwtService = new JWTService();
const mailService = new NodeMailerService();
const otpGenerator = new NodeOtpGenerator();
const passwordHasher = new BcryptPasswordHasher();
const otpService = new OtpRepositoryMongo();
// const S3fileProvider = new S3FileProvider()
const imageKitfileProvider = new ImageKitFileStorage();
const logger = new WinstonLogger();


// Use Cases (Authentication)
const loginAdmin = new LoginAdmin(adminRepository, jwtService, passwordHasher, logger);
const loginUser = new LoginUser(userRepository, jwtService, passwordHasher, logger);
const refreshUser = new RefreshTokenUser(userRepository, jwtService);
const refreshAdmin = new RefreshTokenAdmin(adminRepository, jwtService);
const viewerRegister = new SignupViewer(userRepository, otpService, mailService, passwordHasher, otpGenerator);
const managerRegister = new SignupManager(userRepository, managerRepository, otpService, mailService, passwordHasher, otpGenerator);
const playerRegister = new SignupPlayer(userRepository, playerRepository, otpService, mailService, passwordHasher, otpGenerator);
const userLogout = new LogoutUser(userRepository);
const adminLogout = new LogoutAdmin(adminRepository);
const verifyOtp = new VerifyOtp(userRepository, otpService);
const resetPassword = new ResetPassword(userRepository, otpService, passwordHasher);
const forgotPassword = new ForgotPassword(userRepository, otpService, mailService, otpGenerator);

// Use Cases (Admin)
const getAllViewers = new GetAllViewers(userRepository, logger);
const getAllManagers = new GetAllManagers(userRepository, logger);
const getAllPlayers = new GetAllPlayers(userRepository, logger);
const changeUserStatus = new ChangeUserStatus(userRepository, logger);

// use case (manager)
const updateProfile = new UpdateManagerProfile(userRepository, imageKitfileProvider)


const scheduler = new NodeCronScheduler();

// Cron job wiring
deleteUnverifiedUsersCron(scheduler, userRepository, playerRepository, managerRepository);

// Controllers
export const adminLoginController = new AdminLoginController(loginAdmin);
export const userLoginController = new UserLoginController(loginUser);
export const adminRefreshController = new AdminRefreshController(refreshAdmin);
export const userRefreshController = new UserRefreshController(refreshUser);
export const viewerSignupController = new ViewerSignupController(viewerRegister);
export const playerSignupController = new PlayerSignupController(playerRegister);
export const managerSignupController = new ManagerSignupController(managerRegister);
export const userLogoutController = new UserLogoutController(userLogout);
export const adminLogoutController = new AdminLogoutController(adminLogout);
export const verifyOtpController = new VerifyOtpController(verifyOtp);
export const resetPasswordController = new ResetPasswordController(resetPassword);
export const forgotPasswordController = new ForgotPasswordController(forgotPassword);

export const getAllViewersController = new GetAllViewersController(getAllViewers);
export const getAllManagerController = new GetAllManagersController(getAllManagers);
export const getAllPlayersController = new GetAllPlayersController(getAllPlayers);

export const updateManagerProfileController = new UpdateManagerProfileController(updateProfile);
export const changeUserStatusController = new ChangeUserStatusController(changeUserStatus, logger);