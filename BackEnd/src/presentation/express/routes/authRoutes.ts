import { Router, Request, Response } from 'express';
import { expressAdapter } from 'presentation/adaptors/ExpressAdaptor';
import {
    adminLoginController,
    userLoginController,
    userRefreshController,
    viewerSignupController,
    playerSignupController,
    managerSignupController,
    userLogoutController,
    verifyOtpController,
    resetPasswordController,
    forgotPasswordController
} from '../../container/container';

const router = Router();

router.post('/admin/login', async (req: Request, res: Response) => {
    await expressAdapter(req, res, adminLoginController);
});

router.post('/login', async (req: Request, res: Response) => {
    await expressAdapter(req, res, userLoginController);
});

router.get('/refresh', async (req: Request, res: Response) => {
    await expressAdapter(req, res, userRefreshController);
});

router.post('/signup/viewer', async (req: Request, res: Response) => {
    await expressAdapter(req, res, viewerSignupController);
});

router.post('/signup/manager', async (req: Request, res: Response) => {
    await expressAdapter(req, res, managerSignupController);
});

router.post('/signup/player', async (req: Request, res: Response) => {
    await expressAdapter(req, res, playerSignupController);
});

router.post('/logout', async (req: Request, res: Response) => {
    await expressAdapter(req, res, userLogoutController);
});

router.post('/resend-otp', async (req: Request, res: Response) => {
    await expressAdapter(req, res, verifyOtpController);
});
 
router.post('/verify-otp', async (req: Request, res: Response) => {
    await expressAdapter(req, res, verifyOtpController);
});

router.post('/forgot-password', async (req: Request, res: Response) => {
    await expressAdapter(req, res, forgotPasswordController);
});

router.post('/reset-password', async (req: Request, res: Response) => {
    await expressAdapter(req, res, resetPasswordController);
});


export default router;