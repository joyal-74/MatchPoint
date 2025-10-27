import { AuthController } from 'presentation/http/controllers/authentication/AuthController';
import { jwtService, mailService, otpGenerator, passwordHasher, logger, userIdGenerator, managerIdGenerator, playerIdGenerator } from '../shared/providers';
import { userRepository, adminRepository, playerRepository, managerRepository, otpRepository } from '../shared/repositories';
import { LoginAdmin } from 'app/usecases/auth/LoginAdmin';
import { LoginUser } from 'app/usecases/auth/LoginUser';
import { RefreshToken } from 'app/usecases/auth/RefreshToken';
import { SignupViewer } from 'app/usecases/auth/SignupViewer';
import { SignupManager } from 'app/usecases/auth/SignUpManager';
import { SignupPlayer } from 'app/usecases/auth/SignupPlayer';
import { LogoutUser } from 'app/usecases/auth/Logout';
import { VerifyOtp } from 'app/usecases/auth/VerifyOtp';
import { ResendOtp } from 'app/usecases/auth/ResendOtp';
import { ResetPassword } from 'app/usecases/auth/ResetPassword';
import { ForgotPassword } from 'app/usecases/auth/ForgotPassword';
import { LoginGoogleUser } from 'app/usecases/auth/LoginGoogleUser';
import { CompleteSocialSignup } from 'app/usecases/auth/CompleteSocialSignup';
import { LoginFacebookUser } from 'app/usecases/auth/LoginFacebookUser';
import { facebookServices, googleAuthService, logoutServices, playerServices, userAuthService, userServices } from '../shared/services';

// Auth use cases
const loginAdminUC = new LoginAdmin(adminRepository, jwtService, passwordHasher, logger);
const loginUserUC = new LoginUser(userRepository, jwtService, passwordHasher, logger);
const googleLoginUserUC = new LoginGoogleUser(userRepository, jwtService, googleAuthService, userAuthService, logger);
const facebookLoginUserUC = new LoginFacebookUser(facebookServices, jwtService, userServices,userAuthService,logger);
const refreshTokenUC = new RefreshToken(userRepository, adminRepository, jwtService, logger);
const completeGoogleProfileUC = new CompleteSocialSignup(jwtService, userServices, playerServices, logger);
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
    facebookLoginUserUC,
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