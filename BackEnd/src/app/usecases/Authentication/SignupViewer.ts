import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { UserRegister } from "domain/entities/User";
import { UserRoles } from "domain/enums";
import { validateUserInput } from "domain/validators/UserValidators";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";
import { IViewerSignupUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";
import { UserMapper } from "app/mappers/UserMapper";
import { IUserIdGenerator } from "app/providers/IIdGenerator";


export class SignupViewer implements IViewerSignupUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _passwordHasher: IPasswordHasher,
        private _otpGenerator: IOtpGenerator,
        private _idGenerator: IUserIdGenerator,
    ) { }

    async execute(userData: UserRegister) {
        const validData = validateUserInput(userData);

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
            phone : validData.phone,
            wallet: 0,
            isActive: true,
            isVerified: false,
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

        return { success: true, message : "Viewer registered successfully", user: userDTO, expiresAt };
    }
}