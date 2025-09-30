import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";
import { IResendOtpUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";

export class ResendOtp implements IResendOtpUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _otpGenerator: IOtpGenerator
    ) { }

    /**
     * Executes the resend OTP flow.
     *
     * @param email - The email of the user requesting OTP resend
     * @param context - The OTP context (ACCOUNT_VERIFICATION, FORGOT_PASSWORD)
     * @returns A success response with a confirmation message
     * @throws BadRequestError if the user is not found
     *
     */
    async execute(email: string, context: OtpContext) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new BadRequestError("User not found");

        const otp = this._otpGenerator.generateOtp();

        await this._otpRepository.deleteOtp(user._id, context);
        await this._otpRepository.saveOtp(user._id, email, otp, context);

        await this._mailRepository.sendVerificationEmail(email, otp, context);

        return { success: true, message: "OTP resent successfully" };
    }
}