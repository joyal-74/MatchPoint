import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { BadRequestError, NotFoundError } from "domain/errors";

export class VerifyAccount {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOtpRepository
    ) { }

    async execute({ email, otp }: { email: string; otp: string }): Promise<{ success: boolean; message: string }> {
        // 1. Find OTP record
        const otpRecord = await this.otpRepository.findOtpByEmail(email);
        if (!otpRecord) {
            throw new NotFoundError("OTP not found or expired");
        }

        // 2. Validate OTP
        if (otpRecord.otp !== otp) {
            throw new BadRequestError("Invalid OTP");
        }

        // 3. Mark user as verified
        await this.userRepository.update(otpRecord.userId, { isVerified: true });

        // 4. Remove OTP record (optional)
        await this.otpRepository.deleteOtp(otpRecord.userId);

        return { success: true, message: "Email verified successfully" };
    }
}