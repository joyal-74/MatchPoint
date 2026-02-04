import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { File } from "../../../domain/entities/File.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IUmpireSignupUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository.js";
import { IMailRepository } from "../../providers/IMailRepository.js";
import { IPasswordHasher } from "../../providers/IPasswordHasher.js";
import { IOtpGenerator } from "../../providers/IOtpGenerator.js";
import { IUmpireIdGenerator } from "../../providers/IIdGenerator.js";
import { IFileStorage } from "../../providers/IFileStorage.js";
import { validateUserInput } from "../../../domain/validators/UserValidators.js";
import { UserRegister } from "../../../domain/entities/User.js";
import { BadRequestError } from "../../../domain/errors/index.js";
import { UserRoles } from "../../../domain/enums/Roles.js";
import { OtpContext } from "../../../domain/enums/OtpContext.js";
import { UserMapper } from "../../mappers/UserMapper.js";



@injectable()
export class SignupUmpire implements IUmpireSignupUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.Mailer) private _mailRepository: IMailRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.OtpGenerator) private _otpGenerator: IOtpGenerator,
        @inject(DI_TOKENS.UmpireIdGenerator) private _idGenerator: IUmpireIdGenerator,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
    ) { }

    async execute(userData: UserRegister, file?: File) {
        const validData = validateUserInput(userData);

        if (file) {
            const fileKey = await this._fileStorage.upload(file);
            validData.profileImage = fileKey;
        }

        const existingUser = await this._userRepository.findByEmail(validData.email);
        if (existingUser) throw new BadRequestError("Account already exists");

        const hashedPassword = await this._passwordHasher.hashPassword(validData.password);
        const userId = this._idGenerator.generate();

        const newUser = await this._userRepository.create({
            userId: userId,
            email: validData.email,
            firstName: validData.firstName,
            lastName: validData.lastName,
            role: UserRoles.Umpire,
            password: hashedPassword,
            username: `ump-${Date.now()}`,
            phone: validData.phone,
            isActive: true,
            isVerified: false,
            profileImage : validData.profileImage,
            settings: {
                theme: "light",
                language: validData.settings?.language || "en",
                country: validData.settings?.country || 'India',
                currency: 'INR'
            }
        });

        // Trigger Verification Flow
        const otp = this._otpGenerator.generateOtp();
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);
        await this._mailRepository.sendVerificationEmail(newUser.email, otp);
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);


        return {
            success: true,
            message: "Umpire account created. Please verify your email.",
            user: UserMapper.toUserLoginResponseDTO(newUser),
            expiresAt
        };
    }
}
