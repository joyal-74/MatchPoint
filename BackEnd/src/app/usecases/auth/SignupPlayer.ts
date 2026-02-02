import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/shared/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { UserRoles } from "domain/enums";
import { IPlayerRepository } from "app/repositories/interfaces/player/IPlayerRepository";
import { PlayerRegister } from "domain/entities/Player";
import { validatePlayerInput } from "domain/validators/PlayerValidators";
import { getDefaultCareerStats } from "infra/utils/playerDefaults";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";
import { IPlayerSignupUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { IPlayerIdGenerator } from "app/providers/IIdGenerator";
import { UserMapper } from "app/mappers/UserMapper";
import { IFileStorage } from "app/providers/IFileStorage";
import { File } from "domain/entities/File";



@injectable()
export class SignupPlayer implements IPlayerSignupUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.PlayerRepository) private _playerRepository: IPlayerRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.Mailer) private _mailRepository: IMailRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.OtpGenerator) private _otpGenerator: IOtpGenerator,
        @inject(DI_TOKENS.PlayerIdGenerator) private _idGenerator: IPlayerIdGenerator,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
    ) { }

    async execute(userData: PlayerRegister, file?: File) {
        const validData = validatePlayerInput(userData);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

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
            username: `user-${Date.now()}`,
            phone: validData.phone,
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

        const profile = {
            battingStyle :  validData.battingStyle,
            bowlingStyle :  validData.bowlingStyle,
            position :  validData.playingPosition,
            jerseyNumber : validData.jerseyNumber,
        }

        await this._playerRepository.create({
            userId: newUser._id,
            sport: userData.sport ?? 'cricket',
            profile: profile,
            stats: getDefaultCareerStats('cricket'),
        });

        const otp = this._otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        await this._mailRepository.sendVerificationEmail(newUser.email, otp);

        const userDTO = UserMapper.toUserLoginResponseDTO(newUser)

        return { success: true, message: "Player registered successfully", user: userDTO, expiresAt };
    }
}