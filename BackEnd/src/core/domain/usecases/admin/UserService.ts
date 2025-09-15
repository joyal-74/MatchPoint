import type { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import type { User } from '../../entities/User';
import { generateViewerId, generateManagerId, generatePlayerId } from '../../../../shared/utils/helpers/UserIdHelper';
import * as bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { UserRole } from '../../types/UserRoles';
import { PersistedUser } from '@shared/types/Types';
import { MailService } from '@infra/services/email/MailService';
import { IOtpRepository } from '@core/domain/repositories/interfaces/IOtpRepository';

export class UserService {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository,
        private mailService: MailService
    ) { }

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

    async getUserByEmail(email: string): Promise<PersistedUser | null> {
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

    async sendEmailVerification(email: string): Promise<Date> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("User not found");

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await this.otpRepository.saveOtp(user.userId, otp, expiresAt);

        await this.mailService.sendVerificationEmail(email, otp);

        return expiresAt;
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("User not found");

        const otpRecord = await this.otpRepository.findOtp(user.userId);

        if (!otpRecord) {
            throw new Error("OTP expired");
        }

        if (otpRecord.code !== otp) {
            throw new Error("Invalid OTP");
        }

        await this.userRepository.update(user.userId, { isVerified: true });

        await this.otpRepository.deleteOtp(user.userId);

        return true;
    }

    async login(email: string, password: string): Promise<PersistedUser> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        return user;
    }

    async resendOtp(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("User not found");

        await this.otpRepository.deleteOtp(user.userId);

        const otp = crypto.randomInt(100000, 999999).toString();

        await this.otpRepository.saveOtp(
            user.userId,
            otp,
            new Date(Date.now() + 10 * 60 * 1000)
        );

        await this.mailService.sendVerificationEmail(email, otp);
    }
}