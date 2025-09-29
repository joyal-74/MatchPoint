import { Router } from 'express';
import { expressAdapter } from 'presentation/adaptors/ExpressAdaptor';
import { authController } from '../../container/container';

const router = Router();

router.post('/admin/login', expressAdapter(authController.loginAdmin));
router.post('/login', expressAdapter(authController.loginUser));
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