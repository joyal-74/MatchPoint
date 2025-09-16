import { Request, Response } from 'express';
import { UserService } from '../../../../core/domain/usecases/admin/UserService';
import { PlayerService } from '../../../../core/domain/usecases/admin/PlayerService';
import { CareerStatsService } from '../../../../core/domain/usecases/admin/CareerStatService';
import { toUserResponseDTO } from '../dtos/User.dto';
import bcrypt from 'bcryptjs';
import { AuthService } from '@app/services/AuthService';
import { UserRole } from '@core/domain/types/UserRoles';
import { AuthEntity, PersistedUser } from '@shared/types/Types';

export class UserController {
    constructor(
        private userService: UserService,
        private playerService: PlayerService,
        private careerStatsService: CareerStatsService,
        private authService: AuthService
    ) { }

    async getAllViewers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllViewers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getAllPlayers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllPlayers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getAllManagers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllManagers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async signupViewer(req: Request, res: Response) {
        try {
            const user = await this.userService.createViewer(req.body);
            const expiresAt = await this.userService.sendEmailVerification(user.email);
            res.status(201).json({
                success: true,
                data: { user, expiresAt },
                message: 'Viewer created successfully'
            });
        } catch (err: any) {
            console.log(err)
            res.status(400).json({ error: err.message });
        }
    }

    async signupPlayer(req: Request, res: Response) {
        try {
            const { sport } = req.body;
            if (!sport) {
                throw new Error('Sport is required for player signup');
            }

            const user = await this.userService.createPlayer(req.body);
            const expiresAt = await this.userService.sendEmailVerification(user.email);
            const playerProfile = await this.playerService.createPlayerProfile(user._id, sport);
            const careerStats = await this.careerStatsService.initializeCareerStats(user._id, sport);

            res.status(201).json({
                success: true,
                data: { user, expiresAt },
                playerProfile,
                careerStats,
                message: 'Player created successfully',
            });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
            console.log(err)
        }
    }

    async signupManager(req: Request, res: Response) {
        try {
            const user = await this.userService.createManager(req.body);
            const expiresAt = await this.userService.sendEmailVerification(user.email);

            res.status(201).json({
                success: true,
                data: { user, expiresAt },
                message: "Manager created successfully"
            });

        } catch (err: any) {
            console.log(err)
            res.status(400).json({ success: false, error: err.message });
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const expiresAt = await this.userService.sendEmailVerification(email);

            res.status(200).json({
                success: true,
                message: "OTP resent successfully",
                expiresAt,
            });
        } catch (err: any) {
            res.status(400).json({ success: false, error: err.message });
        }
    }


    async verifyOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            const success = await this.userService.verifyOtp(email, otp);

            if (success) {
                res.status(200).json({ success: true, message: "Verification successful" });
                return;
            } else {
                res.status(400).json({ success: false, message: "Invalid OTP" });
                return;
            }
        } catch (err: any) {
            console.log(err)
            res.status(500).json({ success: false, message: err.message || "Something went wrong" });
            return;
        }
    };


    async loginUsers(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userService.getUserByEmail(email);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }

            if (!user.password) {
                res.status(400).json({
                    success: false,
                    error: { code: "INVALID_CREDENTIALS", message: "User has no password set" }
                });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" }
                });
                return;
            }

            function toAuthEntity(user: PersistedUser): AuthEntity {
                return {
                    _id: user._id,
                    email: user.email,
                    role: user.role as UserRole,
                };
            }


            const { accessToken, refreshToken } = await this.authService.generateTokens(toAuthEntity(user));

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true, message: "Login successful",
                data: {
                    accessToken,
                    user: toUserResponseDTO(user),
                }
            });

        } catch (error: any) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                error: { code: "INVALID_CREDENTIALS", message: error.message || "Internal server error" }
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const expiresAt = await this.userService.forgotPassword(email);
            res.status(200).json({
                success: true,
                data: { expiresAt },
                message: "OTP sent to your email",
            });
        } catch (err: any) {
            res.status(400).json({
                success: false,
                message: err.message || "Something went wrong",
            });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
                res.status(400).json({ error: "Email, OTP, and new password are required" });
                return;
            }

            await this.userService.resetPassword(email, otp, newPassword);

            res.status(200).json({ message: "Password reset successfully" });
            return
        } catch (err: any) {
            res.status(400).json({ error: err.message });
            return;
        }
    }

    async logoutUser(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                await this.authService.logout(refreshToken);
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        } catch (error: any) {
            console.error("Logout error:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }
}