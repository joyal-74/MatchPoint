import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";

export class ResendOtp {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _mailRepository: IMailRepository,
        private _otpGenerator: IOtpGenerator
    ) { }

    async execute(email: string, context: OtpContext): Promise<{ success: boolean; message: string }> {
        // 1. Find user
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new BadRequestError("User not found");

        // 2. Generate new OTP
        const otp = this._otpGenerator.generateOtp();

        // 3. Save OTP in DB with context
        await this._otpRepository.saveOtp(user._id, email, otp, context);

        // 4. Send OTP email with context
        await this._mailRepository.sendVerificationEmail(email, otp, context);

        return { success: true, message: "OTP resent successfully" };
    }
}
