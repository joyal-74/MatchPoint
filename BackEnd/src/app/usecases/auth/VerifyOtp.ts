import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/shared/IOtpRepository";
import { BadRequestError, NotFoundError } from "domain/errors";
import { OtpContext } from "domain/enums/OtpContext";
import { IVerifyOtpUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";

export class VerifyOtp implements IVerifyOtpUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository
    ) { }

    async execute(email: string, otp: string, context: OtpContext) {
        const otpRecord = await this._otpRepository.findOtpByEmail(email);
        if (!otpRecord) {
            throw new NotFoundError("OTP not found or expired");
        }

        if (otpRecord.otp !== otp) {
            throw new BadRequestError("Invalid OTP");
        }

        if (context === OtpContext.VerifyEmail) {
            await this._userRepository.update(otpRecord.userId, { isVerified: true });
        }

        await this._otpRepository.deleteOtp(otpRecord.userId, context);

        return {
            success: true,
            message: context === OtpContext.VerifyEmail ? "Email verified successfully" : "OTP verified, proceed with password reset",
        };
    }
}
