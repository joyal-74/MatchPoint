import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { BadRequestError } from "domain/errors";
import { OtpContext } from "domain/enums/OtpContext";

export class ResetPassword {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _passwordHasher: IPasswordHasher
    ) {}

    async execute(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        // 1. Find user
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new BadRequestError("User not found");

        // 2. Hash new password
        const hashedPassword = await this._passwordHasher.hashPassword(newPassword);

        // 3. Update password in DB
        await this._userRepository.update(user._id, { password: hashedPassword, refreshToken: null });

        // 4. Clear OTP for forgot password context
        await this._otpRepository.deleteOtp(user._id, OtpContext.ForgotPassword);

        return { success: true, message: "Password has been reset successfully" };
    }
}
