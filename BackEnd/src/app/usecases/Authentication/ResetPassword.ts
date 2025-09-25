import { IUserRepository } from "app/repositories/interfaces/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/IOtpRepository";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { BadRequestError } from "domain/errors";
import { OtpContext } from "domain/enums/OtpContext";
import { IResetPasswordUseCase } from "app/repositories/interfaces/IAuthenticationUseCase";

export class ResetPassword implements IResetPasswordUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _otpRepository: IOtpRepository,
        private _passwordHasher: IPasswordHasher
    ) {}

    async execute(email: string, newPassword: string) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new BadRequestError("User not found");

        const hashedPassword = await this._passwordHasher.hashPassword(newPassword);

        await this._userRepository.update(user._id, { password: hashedPassword, refreshToken: null });

        await this._otpRepository.deleteOtp(user._id, OtpContext.ForgotPassword);

        return { success: true, message: "Password has been reset successfully" };
    }
}