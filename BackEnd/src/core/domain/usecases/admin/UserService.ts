import type { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import type { User } from '../../entities/User';
import { generateViewerId, generateManagerId, generatePlayerId } from '../../../../shared/utils/helpers/UserIdHelper';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../types/UserRoles';
import { PersistedUser } from '@shared/types/Types';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async getAllViewers(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.VIEWER) ?? [];
    }

    async getAllPlayers(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.PLAYER) ?? [];
    }

    async getAllManagers(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.MANAGER) ?? [];
    }

    async getUserById(userId: string): Promise<User | null> {
        return this.userRepository.findById(userId);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    private async validateUserData(userData: Partial<User>) {
        if (!userData.email) throw new Error("Email is required");

        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) throw new Error("User with this email already exists");
    }


    private async createUser(userData: Partial<User>, role: UserRole): Promise<User> {
        await this.validateUserData(userData);

        const hashedPassword = await bcrypt.hash(userData.password!, 10);

        let generatedId: string;
        switch (role) {
            case UserRole.PLAYER:
                generatedId = generatePlayerId();
                break;
            case UserRole.MANAGER:
                generatedId = generateManagerId();
                break;
            default:
                generatedId = generateViewerId();
        }

        const newUser: User = {
            ...userData,
            userId: generatedId,
            password: hashedPassword,
            role,
            wallet: userData.wallet || 0,
            isActive: true,
            settings: userData.settings || { theme: 'light', language: 'en', currency: 'USD' },
            createdAt: new Date(),
            updatedAt: new Date(),
        } as User;

        return this.userRepository.create(newUser);
    }


    async createViewer(userData: Partial<User>): Promise<User> {
        return this.createUser(userData, UserRole.VIEWER);
    }

    async createPlayer(data: any): Promise<PersistedUser> {
        const user = await this.createUser(data, UserRole.PLAYER);
        return user as PersistedUser;
    }

    async createManager(userData: Partial<User>): Promise<User> {
        return this.createUser(userData, UserRole.MANAGER);
    }
}