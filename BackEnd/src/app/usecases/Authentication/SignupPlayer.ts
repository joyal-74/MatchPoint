import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { generatePlayerId } from "infra/utils/UserIdHelper";
import { BadRequestError, InternalServerError } from "domain/errors";
import { UserRoles } from "domain/enums";
import { IPlayerRepository } from "app/repositories/interfaces/IPlayerRepository";
import { PlayerRegister } from "domain/entities/Player";
import { PlayerRegisterResponseDTO } from "domain/dtos/Player.dto";
import { validatePlayerInput } from "domain/validators/PlayerValidators";
import { getDefaultCareerStats, getDefaultProfile } from "infra/utils/playerDefaults";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";


export class SignupPlayer {
    constructor(
        private userRepository: IUserRepository,
        private playerRepository: IPlayerRepository,
        private otpRepository: IOtpRepository,
        private mailRepository: IMailRepository,
        private passwordHasher: IPasswordHasher,
        private otpGenerator: IOtpGenerator,
    ) { }

    async execute(userData: PlayerRegister): Promise<{ user: PlayerRegisterResponseDTO; expiresAt: Date }> {
        const validData = validatePlayerInput(userData);

        const existingUser = await this.userRepository.findByEmail(validData.email);
        if (existingUser) throw new BadRequestError("User with this email already exists");

        const hashedPassword = await this.passwordHasher.hashPassword(validData.password);
        const userId = generatePlayerId();

        const newUser = await this.userRepository.create({
            userId: userId,
            email: validData.email,
            first_name: validData.first_name,
            last_name: validData.last_name,
            gender: validData.gender,
            role: UserRoles.Player,
            password: hashedPassword,
            wallet: 0,
            isActive: true,
            isVerified: false,
            settings: {
                theme: validData.settings?.theme || "dark",
                language: validData.settings?.language || "en",
                currency: validData.settings?.currency || "USD",
                location: validData.settings?.location,
                country: validData.settings?.country,
            }

        });

        const newPlayer = await this.playerRepository.create({
            userId: newUser._id,
            sport: userData.sport,
            profile: getDefaultProfile(userData.sport),
            stats: getDefaultCareerStats(userData.sport),
        });

        const otp = this.otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        try {
            await this.mailRepository.sendVerificationEmail(newUser.email, otp);
        } catch (err) {
            throw new InternalServerError("Failed to send verification email");
        }

        const userDTO: PlayerRegisterResponseDTO = {
            _id: newUser._id,
            userId: newUser.userId,
            email: newUser.email,
            sport: newPlayer.sport,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            role: newUser.role,
        };

        return { user: userDTO, expiresAt };
    }
}