import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

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
import { IFileStorage } from "app/providers/IFileStorage";
import { File } from "domain/entities/File";

@injectable()
export class SignupManager implements IManagerSignupUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.ManagerRepository) private _managerRepository: IManagerRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.Mailer) private _mailRepository: IMailRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
        @inject(DI_TOKENS.OtpGenerator) private _otpGenerator: IOtpGenerator,
        @inject(DI_TOKENS.ManagerIdGenerator) private _idGenerator: IManagerIdGenerator,
        @inject(DI_TOKENS.FileStorage) private _fileStorage: IFileStorage,
    ) { }

    async execute(userData: ManagerRegister, file? :File) {
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
            role: UserRoles.Manager,
            password: hashedPassword,
            username: `user-${Date.now()}`,
            wallet: 0,
            phone: validData.phone,
            isActive: true,
            isVerified: false,
            profileImage : validData.profileImage,
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
            tournamentsCreated: [],
            teams: [],
        });

        const otp = this._otpGenerator.generateOtp();
        console.log(otp, 'otp')
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        await this._mailRepository.sendVerificationEmail(newUser.email, otp);

        const managerDTO = UserMapper.toUserLoginResponseDTO(newUser)

        return { success: true, message: "Manager Registered successfully", user: managerDTO, expiresAt };
    }
}