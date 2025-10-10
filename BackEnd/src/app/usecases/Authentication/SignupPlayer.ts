import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { UserRoles } from "domain/enums";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { PlayerRegister } from "domain/entities/Player";
import { validatePlayerInput } from "domain/validators/PlayerValidators";
import { getDefaultCareerStats, getDefaultProfile } from "infra/utils/playerDefaults";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";
import { IPlayerSignupUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";
import { IPlayerIdGenerator } from "app/providers/IIdGenerator";
import { UserMapper } from "app/mappers/UserMapper";


export class SignupPlayer implements IPlayerSignupUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _playerRepository: IPlayerRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _passwordHasher: IPasswordHasher,
        private _otpGenerator: IOtpGenerator,
        private _idGenerator: IPlayerIdGenerator,
    ) { }

    async execute(userData: PlayerRegister) {
        const validData = validatePlayerInput(userData);

        const existingUser = await this._userRepository.findByEmail(validData.email);
        if (existingUser) throw new BadRequestError("User with this email already exists");

        const hashedPassword = await this._passwordHasher.hashPassword(validData.password);

        const userId = this._idGenerator.generate();

        const newUser = await this._userRepository.create({
            userId: userId,
            email: validData.email,
            firstName: validData.firstName,
            lastName: validData.lastName,
            gender: validData.gender,
            role: UserRoles.Player,
            password: hashedPassword,
            username: "",
            wallet: 0,
            sport: validData.sport,
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

        await this._playerRepository.create({
            userId: newUser._id,
            sport: userData.sport,
            profile: getDefaultProfile(userData.sport),
            stats: getDefaultCareerStats(userData.sport),
        });

        const otp = this._otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        await this._mailRepository.sendVerificationEmail(newUser.email, otp);

        const userDTO = UserMapper.toUserLoginResponseDTO(newUser)

        return { success : true, message : "Player registered successfully", user: userDTO, expiresAt };
    }
}