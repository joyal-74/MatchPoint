import { Router } from 'express';
import { expressAdapter } from 'presentation/adaptors/ExpressAdaptor';
import { AuthController } from 'presentation/http/controllers/authentication/AuthController';
import { container } from 'tsyringe';

const router = Router();

const authController = container.resolve(AuthController);

router.post('/admin/login', expressAdapter(authController.loginAdmin));
router.post('/login', expressAdapter(authController.loginUser));
router.post('/google-login', expressAdapter(authController.loginGoogleUser));
router.post('/facebook-login', expressAdapter(authController.loginFacebookUser));
router.post('/social-complete', expressAdapter(authController.completeSocialAccount));
router.get('/refresh', expressAdapter(authController.refreshToken));

router.post('/signup/viewer', expressAdapter(authController.signupViewer));
router.post('/signup/manager', expressAdapter(authController.signupManager));
router.post('/signup/player', expressAdapter(authController.signupPlayer));

router.post('/logout', expressAdapter(authController.logout));
router.post('/resend-otp', expressAdapter(authController.resendOtp));
router.post('/verify-otp', expressAdapter(authController.verifyOtp));

router.post('/forgot-password', expressAdapter(authController.forgotPassword));
router.post('/reset-password', expressAdapter(authController.resetPassword));

export default router;