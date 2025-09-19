import { UserRepositoryMongo } from '../../infra/repositories/mongo/UserRepositoryMongo';
import { AdminRepositoryMongo } from '../../infra/repositories/mongo/AdminRepositoryMongo';
import { PlayerRepositoryMongo } from '../../infra/repositories/mongo/PlayerRepositoryMongo';
import { JWTService } from '../../infra/services/jwtServices';
import { NodeMailerService } from '../../infra/services/NodeMailerService';
import { NodeOtpGenerator } from '../../infra/providers/NodeOtpGenerator';
import { OtpRepositoryMongo } from '../../infra/repositories/mongo/OtpRepositoryMongo';
import { BcryptPasswordHasher } from '../../infra/providers/BcryptPasswordHasher';
import { LoginAdmin } from '../../app/usecases/Authentication/LoginAdmin';
import { LoginUser } from '../../app/usecases/Authentication/LoginUser';
import { RefreshTokenUser } from '../../app/usecases/Authentication/RefreshTokenUser';
import { RefreshTokenAdmin } from '../../app/usecases/Authentication/RefreshTokenAdmin';
import { SignupViewer } from '../../app/usecases/Authentication/SignupViewer';
import { SignupPlayer } from '../../app/usecases/Authentication/SignupPlayer';
import { SignupManager } from '../../app/usecases/Authentication/SignUpManager';
import { AdminLoginController } from '../http/controllers/AdminLoginController';
import { UserLoginController } from '../http/controllers/UserLoginController';
import { AdminRefreshController } from '../http/controllers/AdminRefreshController';
import { UserRefreshController } from '../http/controllers/UserRefreshController';
import { ViewerSignupController } from '../http/controllers/ViewerSignupController';
import { PlayerSignupController } from '../http/controllers/PlayerSignupController';
import { ManagerRepositoryMongo } from 'infra/repositories/mongo/ManagerRepositoryMongo';
import { ManagerSignupController } from '../http/controllers/ManagerSignupController';
import { UserLogoutController } from '../http/controllers/UserLogoutController';
import { LogoutUser } from 'app/usecases/Authentication/LogoutUser';
import { LogoutAdmin } from 'app/usecases/Authentication/LogoutAdmin';
import { AdminLogoutController } from 'presentation/http/controllers/AdminLogoutController';


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

// Use Cases
const loginAdmin = new LoginAdmin(adminRepository, jwtService, passwordHasher);
const loginUser = new LoginUser(userRepository, jwtService, passwordHasher);
const refreshUser = new RefreshTokenUser(userRepository, jwtService);
const refreshAdmin = new RefreshTokenAdmin(adminRepository, jwtService);
const viewerRegister = new SignupViewer(userRepository, otpService, mailService, passwordHasher, otpGenerator);
const managerRegister = new SignupManager(userRepository, managerRepository, otpService, mailService, passwordHasher, otpGenerator);
const playerRegister = new SignupPlayer(userRepository, playerRepository, otpService, mailService, passwordHasher, otpGenerator);
const userLogout = new LogoutUser(userRepository);
const adminLogout = new LogoutAdmin(adminRepository);

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