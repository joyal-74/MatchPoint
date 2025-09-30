import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { OtpContext } from "domain/enums/OtpContext";
import { NotFoundError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { IForgotPasswordUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";

export class ForgotPassword implements IForgotPasswordUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _otpGenerator: IOtpGenerator,
    ) { }

    /**
     * Execute the forgot password flow
     * @param email User's email address
     * @returns An object containing message and OTP expiration time
     * @throws NotFoundError if user does not exist
     */
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