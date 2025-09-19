import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { BadRequestError, NotFoundError } from "domain/errors";
import { OtpContext } from "domain/enums/OtpContext";

export class VerifyOtp {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository
    ) { }

    async execute({ email, otp, context }: { email: string; otp: string; context: OtpContext }): Promise<{ success: boolean; message: string }> {
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
            message: context === OtpContext.VerifyEmail? "Email verified successfully" : "OTP verified, proceed with password reset",
        };
    }
}
