import { Request, Response } from 'express';
import { UserService } from '../../../../core/domain/usecases/admin/UserService';
import { PlayerService } from '../../../../core/domain/usecases/admin/PlayerService'; 
import { CareerStatsService } from '../../../../core/domain/usecases/admin/CareerStatService'; 

export class UserController {
    constructor(
        private userService: UserService,
        private playerService: PlayerService,
        private careerStatsService: CareerStatsService
    ) {}

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
            res.status(201).json({ user, message: 'Viewer created successfully' });
        } catch (err: any) {
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
            const playerProfile = await this.playerService.createPlayerProfile(user._id, sport);
            const careerStats = await this.careerStatsService.initializeCareerStats(user._id, sport);

            res.status(201).json({
                user,
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
            res.status(201).json({ user, message: 'Manager created successfully' });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}