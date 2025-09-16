import { AdminService } from '@app/services/AdminServices';
import { Request, Response } from 'express';

export class AdminController {
    constructor(private adminService: AdminService) {}

    async loginAdmin(req: Request, res: Response) {

        try {
            const { email, password } = req.body;
            const { admin, tokens } = await this.adminService.login(email, password);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ success: true, message: "Login successful", data: { accessToken: tokens.accessToken, admin } });
        } catch (error: any) {
            console.log(error)
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
