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
import { LogoutUser } from 'app/usecases/authentication/Logout';
import { LoginAdmin } from '../../app/usecases/authentication/LoginAdmin';
import { LoginUser } from '../../app/usecases/authentication/LoginUser';
import { RefreshToken } from '../../app/usecases/authentication/RefreshToken';
import { VerifyOtp } from 'app/usecases/authentication/VerifyOtp';
import { ResetPassword } from 'app/usecases/authentication/ResetPassword';
import { ForgotPassword } from 'app/usecases/authentication/ForgotPassword';
import { GetAllViewers } from 'app/usecases/admin/GetAllViewers';
import { GetAllManagers } from 'app/usecases/admin/GetAllManagers';
import { GetAllPlayers } from 'app/usecases/admin/GetAllPlayers';
import { deleteUnverifiedUsersCron } from 'infra/cron/deleteUnverifiedUsersCron';
import { NodeCronScheduler } from 'infra/services/NodeCronScheduler';
import { ImageKitFileStorage } from 'infra/providers/ImageKitFileStorage';
import { UpdateManagerProfileController } from 'presentation/http/controllers/manager/UpdateManagerProfileController';
import { UpdateManagerProfile } from 'app/usecases/manager/UpdateManagerProfile';
import { ChangeUserStatus } from 'app/usecases/admin/ChangeUserStatus';
import { verifyTokenMiddleware } from 'presentation/express/middlewares/verifyTokenMiddleware';
import { AuthController } from 'presentation/http/controllers/authentication/AuthController';
import { ResendOtp } from 'app/usecases/authentication/ResendOtp';
import { UsersManagementController } from 'presentation/http/controllers/admin/UsersManagementController';

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
const imageKitfileProvider = new ImageKitFileStorage();
const logger = new WinstonLogger();

// Use Cases (Authentication)
const loginAdmin = new LoginAdmin(adminRepository, jwtService, passwordHasher, logger);
const loginUser = new LoginUser(userRepository, jwtService, passwordHasher, logger);
const refreshUser = new RefreshToken(userRepository, adminRepository, jwtService, logger);
const viewerRegister = new SignupViewer(userRepository, otpService, mailService, passwordHasher, otpGenerator);
const managerRegister = new SignupManager(userRepository, managerRepository, otpService, mailService, passwordHasher, otpGenerator);
const playerRegister = new SignupPlayer(userRepository, playerRepository, otpService, mailService, passwordHasher, otpGenerator);
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
const updateProfile = new UpdateManagerProfile(userRepository, imageKitfileProvider)


const scheduler = new NodeCronScheduler();

// Cron job wiring
deleteUnverifiedUsersCron(scheduler, userRepository, playerRepository, managerRepository, logger);

// Controllers
export const authController = new AuthController(loginUser, loginAdmin, logout, viewerRegister,
    playerRegister, managerRegister, refreshUser, forgotPassword, verifyOtp, resendOtp, resetPassword);

export const usersManagementController = new UsersManagementController(getAllManagers, getAllPlayers, getAllViewers, changeUserStatus);

export const updateManagerProfileController = new UpdateManagerProfileController(updateProfile);

// role specific access
export const adminOnly = verifyTokenMiddleware(jwtService, ["admin"]);
export const playerOnly = verifyTokenMiddleware(jwtService, ["player"]);
export const managerOnly = verifyTokenMiddleware(jwtService, ["manager"]);