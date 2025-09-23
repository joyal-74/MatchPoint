import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { OtpContext } from "domain/enums/OtpContext";
import { NotFoundError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";

interface ForgotPasswordResult {
    message: string;
    data: {
        expiresAt: Date;
    };
}

export class ForgotPassword {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly otpRepository: IOtpRepository,
        private readonly mailRepository: IMailRepository,
        private readonly otpGenerator: IOtpGenerator,
    ) {}

    async execute(email: string): Promise<ForgotPasswordResult> {
        // Check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("User not found");

        // Generate OTP
        const otp = this.otpGenerator.generateOtp();

        // Save OTP with context forgot password
        await this.otpRepository.deleteOtp(user._id, OtpContext.ForgotPassword);
        await this.otpRepository.saveOtp(user._id, email, otp, OtpContext.ForgotPassword);
        
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        // Send OTP email
        await this.mailRepository.sendVerificationEmail(user.email, otp, OtpContext.ForgotPassword);

        return { message : 'Otp send successfully', data : { expiresAt} }
    }
}
