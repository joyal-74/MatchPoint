import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IForgotPasswordUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository.js";
import { IMailRepository } from "../../providers/IMailRepository.js";
import { IOtpGenerator } from "../../providers/IOtpGenerator.js";
import { NotFoundError } from "../../../domain/errors/index.js";
import { OtpContext } from "../../../domain/enums/OtpContext.js";


@injectable()
export class ForgotPassword implements IForgotPasswordUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.Mailer) private _mailRepository: IMailRepository,
        @inject(DI_TOKENS.OtpGenerator) private _otpGenerator: IOtpGenerator,
    ) { }


    async execute(email: string) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        const otp = this._otpGenerator.generateOtp();

        await this._otpRepository.deleteOtp(user._id, OtpContext.ForgotPassword);

        await this._otpRepository.saveOtp(user._id, email, otp, OtpContext.ForgotPassword);

        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await this._mailRepository.sendVerificationEmail(user.email, otp, OtpContext.ForgotPassword);

        return {
            success: true,
            message: "OTP sent successfully",
            data: { expiresAt },
        };
    }
}
