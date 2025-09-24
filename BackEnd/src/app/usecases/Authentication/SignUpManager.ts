import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { UserRoles } from "domain/enums";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { IManagerRepository } from "app/repositories/interfaces/IManagerRepository";
import { generateManagerId } from "infra/utils/UserIdHelper";
import { ManagerRegister } from "domain/entities/Manager";
import { ManagerRegisterResponseDTO } from "domain/dtos/Manager.dto";
import { validateUserInput } from "domain/validators/UserValidators";
import { OtpContext } from "domain/enums/OtpContext";


export class SignupManager {
    constructor(
        private _userRepository: IUserRepository,
        private _managerRepository: IManagerRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _passwordHasher: IPasswordHasher,
        private _otpGenerator: IOtpGenerator,
    ) { }

    async execute(userData: ManagerRegister): Promise<{ user: ManagerRegisterResponseDTO; expiresAt: Date }> {
        // validate input data
        const validData = validateUserInput(userData);

        // check user already exist or not
        const existingUser = await this._userRepository.findByEmail(validData.email);
        if (existingUser) throw new BadRequestError("User with this email already exists");

        // Hash password before saving
        const hashedPassword = await this._passwordHasher.hashPassword(validData.password);
        const userId = generateManagerId();

        // Create new manager
        const newUser = await this._userRepository.create({
            userId: userId,
            email: validData.email,
            first_name: validData.first_name,
            last_name: validData.last_name,
            gender: validData.gender,
            role: UserRoles.Manager,
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

        // create required fields in manager collection
        await this._managerRepository.create({
            userId: newUser._id,
            wallet: 0,
            tournaments: [],
            teams: [],
        });

        // Generate OTP & save in DB
        const otp = this._otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this._otpRepository.saveOtp(newUser._id, validData.email, otp, OtpContext.VerifyEmail);

        // Verification otp to user email account
        await this._mailRepository.sendVerificationEmail(newUser.email, otp);

        const managerDTO: ManagerRegisterResponseDTO = {
            _id: newUser._id,
            userId: newUser.userId,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            role: newUser.role,
        };

        return { user: managerDTO, expiresAt };
    }
}