import { Router, Request, Response } from 'express';
import { expressAdapter } from 'presentation/adaptors/ExpressAdaptor';
import { authController } from '../../container/container';

const router = Router();

router.post('/admin/login', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.loginAdmin);
});

router.post('/login', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.loginUser);
});

router.get('/refresh', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.refreshToken);
});

router.post('/signup/viewer', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.signupViewer);
});

router.post('/signup/manager', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.signupManager);
});

router.post('/signup/player', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.signupPlayer);
});

router.post('/logout', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.logout);
});

router.post('/resend-otp', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.resendOtp);
});
 
router.post('/verify-otp', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.verifyOtp);
});

router.post('/forgot-password', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.forgotPassword);
});

router.post('/reset-password', async (req: Request, res: Response) => {
    await expressAdapter(req, res, authController.resetPassword);
});


export default router;