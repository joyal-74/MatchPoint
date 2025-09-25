import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { generateViewerId } from "infra/utils/UserIdHelper";
import { BadRequestError } from "domain/errors";
import { UserRegister } from "domain/entities/User";
import { UserRoles } from "domain/enums";
import { validateUserInput } from "domain/validators/UserValidators";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";
import { IViewerSignupUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";
import { UserMapper } from "app/mappers/UserMapper";


export class SignupViewer implements IViewerSignupUseCase {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository,
        private mailRepository: IMailRepository,
        private passwordHasher: IPasswordHasher,
        private otpGenerator: IOtpGenerator,
    ) { }

    async execute(userData: UserRegister) {
        const validData = validateUserInput(userData);

        const existingUser = await this.userRepository.findByEmail(validData.email);
        if (existingUser) throw new BadRequestError("User with this email already exists");

        const hashedPassword = await this.passwordHasher.hashPassword(validData.password);
        const userId = generateViewerId();

        const newUser = await this.userRepository.create({
            userId: userId,
            email: validData.email,
            first_name: validData.first_name,
            last_name: validData.last_name,
            gender: validData.gender,
            role: UserRoles.Viewer,
            password: hashedPassword,
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

        const otp = this.otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        await this.mailRepository.sendVerificationEmail(newUser.email, otp);

        const userDTO = UserMapper.toUserRegisterDTO(newUser);


        return { success: true, message : "Viewer registered successfully", user: userDTO, expiresAt };
    }
}