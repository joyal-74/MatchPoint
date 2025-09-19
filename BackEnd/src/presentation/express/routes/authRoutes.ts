import { Router, Request, Response } from 'express';
import { expressAdapter } from 'presentation/adaptors/ExpressAdaptor';
import {
    adminLoginController,
    userLoginController,
    adminRefreshController,
    userRefreshController,
    viewerSignupController,
    playerSignupController,
    managerSignupController,
    userLogoutController,
    adminLogoutController
} from '../../container/container';

const router = Router();

router.post('/admin/login', async (req: Request, res: Response) => {
    await expressAdapter(req, res, adminLoginController);
});

router.post('/admin/refresh', async (req: Request, res: Response) => {
    await expressAdapter(req, res, adminRefreshController);
});

router.post('/login', async (req: Request, res: Response) => {
    await expressAdapter(req, res, userLoginController);
});

router.post('/refresh', async (req: Request, res: Response) => {
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

router.post('/admin/logout', async (req: Request, res: Response) => {
    await expressAdapter(req, res, adminLogoutController);
});


export default router;