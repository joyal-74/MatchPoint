import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";

import { File } from "../../../domain/entities/File.js";
import { IViewerSignupUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository.js";
import { IMailRepository } from "../../providers/IMailRepository.js";
import { IPasswordHasher } from "../../providers/IPasswordHasher.js";
import { IOtpGenerator } from "../../providers/IOtpGenerator.js";
import { IUserIdGenerator } from "../../providers/IIdGenerator.js";
import { IFileStorage } from "../../providers/IFileStorage.js";
import { UserRegister } from "../../../domain/entities/User.js";
import { validateUserInput } from "../../../domain/validators/UserValidators.js";
import { BadRequestError } from "../../../domain/errors/index.js";
import { UserRoles } from "../../../domain/enums/Roles.js";
import { OtpContext } from "../../../domain/enums/OtpContext.js";
import { UserMapper } from "../../mappers/UserMapper.js";


@injectable()
export class SignupViewer implements IViewerSignupUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.Mailer) private _mailRepository: IMailRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.OtpGenerator) private _otpGenerator: IOtpGenerator,
        @inject(DI_TOKENS.UserIdGenerator) private _idGenerator: IUserIdGenerator,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
    ) { }

    async execute(userData: UserRegister, file?: File) {
        const validData = validateUserInput(userData);

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
            role: UserRoles.Viewer,
            password: hashedPassword,
            username: `user-${Date.now()}`,
            phone: validData.phone,
            wallet: 0,
            isActive: true,
            isVerified: false,
            profileImage : validData.profileImage,
            settings: {
                theme: validData.settings?.theme || "dark",
                language: validData.settings?.language || "en",
                currency: validData.settings?.currency || "INR",
                location: validData.settings?.location,
                country: validData.settings?.country || 'India',
            }
        });

        const otp = this._otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        await this._mailRepository.sendVerificationEmail(newUser.email, otp);

        const userDTO = UserMapper.toUserLoginResponseDTO(newUser);

        return { success: true, message: "Viewer registered successfully", user: userDTO, expiresAt };
    }
}
