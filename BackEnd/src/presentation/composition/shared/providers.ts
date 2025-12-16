import { JWTService } from '../../../infra/services/jwtServices';
import { NodeMailerService } from '../../../infra/services/NodeMailerService';
import { NodeOtpGenerator } from '../../../infra/providers/NodeOtpGenerator';
import { BcryptPasswordHasher } from '../../../infra/providers/BcryptPasswordHasher';
import { WinstonLogger } from 'infra/providers/WinstonLogger';
import { ImageKitFileStorage } from 'infra/providers/ImageKitFileStorage';
import { WalletProvider } from 'infra/providers/WalletProvider';
import { RazorpayProvider } from 'infra/providers/RazorpayProvider';
import { WalletRepository } from 'infra/services/WalletRepository';
import { registrationRepository } from './repositories';
import { ManagerIdGenerator, PlayerIdGenerator, UserIdGenerator } from 'infra/providers/IdGenerator';
import { RoleIdGenerator } from 'infra/providers/RoleIdGenerator';
import { EnvConfigProvider } from 'infra/providers/EnvConfigProvider';
import { RoomRegistry } from 'infra/livestream/mediasoup/RoomRegistry';

export const jwtService = new JWTService();
export const mailService = new NodeMailerService();
export const otpGenerator = new NodeOtpGenerator();
export const passwordHasher = new BcryptPasswordHasher();
export const logger = new WinstonLogger();
export const imageKitfileProvider = new ImageKitFileStorage();
export const playerIdGenerator = new PlayerIdGenerator();
export const managerIdGenerator = new ManagerIdGenerator();
export const userIdGenerator = new UserIdGenerator();
export const roleIdGenerator = new RoleIdGenerator(playerIdGenerator, userIdGenerator, managerIdGenerator);
export const configProvider = new EnvConfigProvider();

export const walletRepository = new WalletRepository();
export const walletProvider = new WalletProvider(walletRepository, registrationRepository);
export const razorpayProvider = new RazorpayProvider(process.env.RAZOR_API_KEY!, process.env.RAZOR_API_SECRET!);

export const roomRegistry = new RoomRegistry()