import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { BadRequestError, NotFoundError } from "domain/errors";
import { OtpContext } from "domain/enums/OtpContext";
import { IVerifyOtpUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";

export class VerifyOtp implements IVerifyOtpUseCase {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository
    ) { }

    async execute(email: string, otp: string, context: OtpContext) {
        const otpRecord = await this.otpRepository.findOtpByEmail(email);
        if (!otpRecord) {
            throw new NotFoundError("OTP not found or expired");
        }

        if (otpRecord.otp !== otp) {
            throw new BadRequestError("Invalid OTP");
        }

        if (context === OtpContext.VerifyEmail) {
            await this.userRepository.update(otpRecord.userId, { isVerified: true });
        }

        await this.otpRepository.deleteOtp(otpRecord.userId, context);

        return {
            success: true,
            message: context === OtpContext.VerifyEmail ? "Email verified successfully" : "OTP verified, proceed with password reset",
        };
    }
}
