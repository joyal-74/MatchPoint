import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/shared/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { UserRoles } from "domain/enums";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { IManagerRepository } from "app/repositories/interfaces/manager/IManagerRepository";
import { ManagerRegister } from "domain/entities/Manager";
import { validateUserInput } from "domain/validators/UserValidators";
import { OtpContext } from "domain/enums/OtpContext";
import { IManagerSignupUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";
import { IManagerIdGenerator } from "app/providers/IIdGenerator";
import { UserMapper } from "app/mappers/UserMapper";


export class SignupManager implements IManagerSignupUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _managerRepository: IManagerRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _passwordHasher: IPasswordHasher,
        private _otpGenerator: IOtpGenerator,
        private _idGenerator: IManagerIdGenerator,
    ) { }

    async execute(userData: ManagerRegister) {
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
            role: UserRoles.Manager,
            password: hashedPassword,
            username: `user-${Date.now()}`,
            wallet: 0,
            phone : validData.phone,
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

        await this._managerRepository.create({
            userId: newUser._id,
            tournaments: [],
            teams: [],
        });

        const otp = this._otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        await this._mailRepository.sendVerificationEmail(newUser.email, otp);

        const managerDTO  = UserMapper.toUserLoginResponseDTO(newUser)

        return { success: true, message: "Manager Registered successfully", user: managerDTO, expiresAt };
    }
}