import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/shared/IOtpRepository";
import { IPasswordHasher } from "app/providers/IPasswordHasher";
import { BadRequestError } from "domain/errors";
import { OtpContext } from "domain/enums/OtpContext";
import { IResetPasswordUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";

@injectable()
export class ResetPassword implements IResetPasswordUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.PasswordHasher) private _passwordHasher: IPasswordHasher,
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