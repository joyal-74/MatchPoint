import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { OtpContext } from "domain/enums/OtpContext";
import { NotFoundError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";

export class ForgotPassword {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly otpRepository: IOtpRepository,
        private readonly mailRepository: IMailRepository,
        private readonly otpGenerator: IOtpGenerator,
    ) {}

    async execute(email: string): Promise<{ success: boolean; message: string }> {
        // 1. Check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        // 2. Generate OTP
        const otp = this.otpGenerator.generateOtp();

        // 3. Save OTP with context forgot password
        await this.otpRepository.saveOtp(user._id, email, otp, OtpContext.ForgotPassword);

        // 4. Send OTP email
        await this.mailRepository.sendVerificationEmail(user.email, otp, OtpContext.ForgotPassword);

        return {
            success: true,
            message: "OTP sent for password reset",
        };
    }
}
