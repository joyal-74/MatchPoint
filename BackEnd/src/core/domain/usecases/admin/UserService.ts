import type { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import type { User } from '../../entities/User';
import { generateViewerId } from '../../../../shared/utils/helpers/UserIdHelper';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../types/UserRoles';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async getAllViewers(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.VIEWER);
    }

    async getAllPlayers(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.PLAYER);
    }

    async getAllManagers(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.MANAGER);
    }

    async getUserById(userId: string): Promise<User | null> {
        return this.userRepository.findById(userId);
    }

    async createViewer(userData: Partial<User>): Promise<User> {
        if (!userData.email || !userData.password || !userData.first_name) {
            throw new Error('Missing required fields');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newViewer: User = {
            ...userData,
            userId: generateViewerId(),
            password: hashedPassword,
            role: userData.role || 'viewer',
            wallet: userData.wallet || 0,
            isActive: true,
            settings: userData.settings || { theme: 'light', language: 'en', currency: 'USD' },
            createdAt: new Date(),
            updatedAt: new Date(),
        } as User;

        return this.userRepository.create(newViewer);
    }
    

    async createPlayer(userData: Partial<User>): Promise<User> {
        if (!userData.email || !userData.password || !userData.first_name) {
            throw new Error('Missing required fields');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newViewer: User = {
            ...userData,
            userId: generateViewerId(),
            password: hashedPassword,
            role: userData.role || 'viewer',
            wallet: userData.wallet || 0,
            isActive: true,
            settings: userData.settings || { theme: 'light', language: 'en', currency: 'USD' },
            createdAt: new Date(),
            updatedAt: new Date(),
        } as User;

        return this.userRepository.create(newViewer);
    }

    async createManager(userData: Partial<User>): Promise<User> {
        if (!userData.email || !userData.password || !userData.first_name) {
            throw new Error('Missing required fields');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newViewer: User = {
            ...userData,
            userId: generateViewerId(),
            password: hashedPassword,
            role: userData.role || 'viewer',
            wallet: userData.wallet || 0,
            isActive: true,
            settings: userData.settings || { theme: 'light', language: 'en', currency: 'USD' },
            createdAt: new Date(),
            updatedAt: new Date(),
        } as User;

        return this.userRepository.create(newViewer);
    }
}