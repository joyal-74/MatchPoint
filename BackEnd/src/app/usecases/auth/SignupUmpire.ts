import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { File } from "../../../domain/entities/File";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { IUmpireSignupUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository";
import { IMailRepository } from "../../providers/IMailRepository";
import { IPasswordHasher } from "../../providers/IPasswordHasher";
import { IOtpGenerator } from "../../providers/IOtpGenerator";
import { IUmpireIdGenerator } from "../../providers/IIdGenerator";
import { IFileStorage } from "../../providers/IFileStorage";
import { validateUserInput } from "../../../domain/validators/UserValidators";
import { UserRegister } from "../../../domain/entities/User";
import { BadRequestError } from "../../../domain/errors/index";
import { UserRoles } from "../../../domain/enums/Roles";
import { OtpContext } from "../../../domain/enums/OtpContext";
import { UserMapper } from "../../mappers/UserMapper";



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
