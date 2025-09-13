import { Request, Response } from 'express';
import { UserService } from '../../../../core/domain/usecases/admin/UserService';
import { UserRole } from '../../../../core/domain/types/UserRoles';

export class UserController {
    constructor(private userService: UserService) { }

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

    async createViewer(req: Request, res: Response) {
        try {
            const user = await this.userService.createViewer(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async createPlayer(req: Request, res: Response) {
        try {
            const user = await this.userService.createPlayer(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    async createManager(req: Request, res: Response) {
        try {
            const user = await this.userService.createManager(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
