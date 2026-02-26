import { Router } from 'express';
import multer from 'multer';

import { container } from 'tsyringe';
import { AuthController } from '../../http/controllers/authentication/AuthController';
import { expressAdapter } from '../../adaptors/ExpressAdaptor';
import { expressFileUpdateHandler } from '../../adaptors/ExpressFileAdaptor';

const router = Router();
const upload = multer();

const authController = container.resolve(AuthController);

router.post('/admin/login', expressAdapter(authController.loginAdmin));
router.post('/login', expressAdapter(authController.loginUser));
router.post('/google-login', expressAdapter(authController.loginGoogleUser));
router.post('/facebook-login', expressAdapter(authController.loginFacebookUser));
router.post('/social-complete', expressAdapter(authController.completeSocialAccount));
router.get('/refresh', expressAdapter(authController.refreshToken));

router.post('/signup/viewer', upload.single("profileImage"), expressFileUpdateHandler(authController.signupViewer));
router.post('/signup/manager', upload.single("profileImage"), expressFileUpdateHandler(authController.signupManager));
router.post('/signup/player', upload.single("profileImage"), expressFileUpdateHandler(authController.signupPlayer));
router.post('/signup/umpire', upload.single("profileImage"), expressFileUpdateHandler(authController.signupUmpire));

router.post('/logout', expressAdapter(authController.logout));
router.post('/resend-otp', expressAdapter(authController.resendOtp));
router.post('/verify-otp', expressAdapter(authController.verifyOtp));

router.post('/forgot-password', expressAdapter(authController.forgotPassword));
router.post('/reset-password', expressAdapter(authController.resetPassword));

export default router;
