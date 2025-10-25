import { AuthController } from 'presentation/http/controllers/authentication/AuthController'; 
import { jwtService, mailService, otpGenerator, passwordHasher, logger } from '../shared/providers';
import { userRepository, adminRepository, playerRepository, managerRepository, otpRepository } from '../shared/repositories';
import { LoginAdmin } from 'app/usecases/Authentication/LoginAdmin';
import { LoginUser } from 'app/usecases/Authentication/LoginUser';
import { RefreshToken } from 'app/usecases/Authentication/RefreshToken';
import { SignupViewer } from 'app/usecases/Authentication/SignupViewer';
import { SignupManager } from 'app/usecases/Authentication/SignUpManager';
import { SignupPlayer } from 'app/usecases/Authentication/SignupPlayer';
import { LogoutUser } from 'app/usecases/Authentication/Logout';
import { VerifyOtp } from 'app/usecases/Authentication/VerifyOtp';
import { ResendOtp } from 'app/usecases/Authentication/ResendOtp';
import { ResetPassword } from 'app/usecases/Authentication/ResetPassword';
import { ForgotPassword } from 'app/usecases/Authentication/ForgotPassword';
import { logoutServices, managerIdGenerator, playerIdGenerator, roleIdGenerator, userIdGenerator } from '../shared/services';
import { LoginGoogleUser } from 'app/usecases/Authentication/LoginGoogleUser';
import { CompleteGoogleSignup } from 'app/usecases/Authentication/CompleteGoogleSignup';

// Auth use cases
const loginAdminUC = new LoginAdmin(adminRepository, jwtService, passwordHasher, logger);
const loginUserUC = new LoginUser(userRepository, jwtService, passwordHasher, logger);
const googleLoginUserUC = new LoginGoogleUser(userRepository, jwtService, logger);
const refreshTokenUC = new RefreshToken(userRepository, adminRepository, jwtService, logger);
const completeGoogleProfileUC = new CompleteGoogleSignup(userRepository,jwtService,roleIdGenerator,logger);
const viewerRegisterUC = new SignupViewer(userRepository, otpRepository, mailService, passwordHasher, otpGenerator, userIdGenerator);
const managerRegisterUC = new SignupManager(userRepository, managerRepository, otpRepository, mailService, passwordHasher, otpGenerator, managerIdGenerator);
const playerRegisterUC = new SignupPlayer(userRepository, playerRepository, otpRepository, mailService, passwordHasher, otpGenerator, playerIdGenerator);
const logoutUC = new LogoutUser(logoutServices, logger);
const verifyOtpUC = new VerifyOtp(userRepository, otpRepository);
const resendOtpUC = new ResendOtp(userRepository, otpRepository, mailService, otpGenerator);
const resetPasswordUC = new ResetPassword(userRepository, otpRepository, passwordHasher);
const forgotPasswordUC = new ForgotPassword(userRepository, otpRepository, mailService, otpGenerator);

export const authControllers = new AuthController(
    loginUserUC,
    googleLoginUserUC,
    completeGoogleProfileUC,
    loginAdminUC,
    logoutUC,
    viewerRegisterUC,
    playerRegisterUC,
    managerRegisterUC,
    refreshTokenUC,
    forgotPasswordUC,
    verifyOtpUC,
    resendOtpUC,
    resetPasswordUC
);
