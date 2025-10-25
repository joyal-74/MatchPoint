import { Router } from 'express';
import { expressAdapter } from 'presentation/adaptors/ExpressAdaptor';
import { authControllers } from 'presentation/composition';


const router = Router();

router.post('/admin/login', expressAdapter(authControllers.loginAdmin));
router.post('/login', expressAdapter(authControllers.loginUser));
router.post('/google-login', expressAdapter(authControllers.loginGoogleUser));
router.post('/google-complete', expressAdapter(authControllers.signupGoogleAccount));
router.get('/refresh', expressAdapter(authControllers.refreshToken));

router.post('/signup/viewer', expressAdapter(authControllers.signupViewer));
router.post('/signup/manager', expressAdapter(authControllers.signupManager));
router.post('/signup/player', expressAdapter(authControllers.signupPlayer));

router.post('/logout', expressAdapter(authControllers.logout));
router.post('/resend-otp', expressAdapter(authControllers.resendOtp));
router.post('/verify-otp', expressAdapter(authControllers.verifyOtp));

router.post('/forgot-password', expressAdapter(authControllers.forgotPassword));
router.post('/reset-password', expressAdapter(authControllers.resetPassword));

export default router;