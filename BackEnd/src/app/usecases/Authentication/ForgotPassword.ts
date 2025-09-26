import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { OtpContext } from "domain/enums/OtpContext";
import { NotFoundError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { IForgotPasswordUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";

/**
 * ForgotPassword Use Case
 * ------------------------
 * Handles the process of initiating a password reset:
 * 1. Verify if user exists
 * 2. Generate OTP
 * 3. Delete any previous OTP for the user
 * 4. Save the new OTP
 * 5. Send OTP via mail
 */
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

        // Remove any old OTPs for ForgotPassword context
        await this._otpRepository.deleteOtp(user._id, OtpContext.ForgotPassword);

        // Save new OTP
        await this._otpRepository.saveOtp(user._id, email, otp, OtpContext.ForgotPassword);

        // Expiration (2 minutes from now)
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        // Send OTP email
        await this._mailRepository.sendVerificationEmail(user.email, otp, OtpContext.ForgotPassword);

        return {
            success: true,
            message: "OTP sent successfully",
            data: { expiresAt },
        };
    }
}