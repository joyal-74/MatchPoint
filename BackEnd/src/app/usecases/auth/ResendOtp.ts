import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "domain/constants/Identifiers";

import { IUserRepository } from "app/repositories/interfaces/shared/IUserRepository";
import { IOtpRepository } from "app/repositories/interfaces/shared/IOtpRepository";
import { IMailRepository } from "app/providers/IMailRepository";
import { BadRequestError } from "domain/errors";
import { IOtpGenerator } from "app/providers/IOtpGenerator";
import { OtpContext } from "domain/enums/OtpContext";
import { IResendOtpUseCase } from "app/repositories/interfaces/auth/IAuthenticationUseCase";

@injectable()
export class ResendOtp implements IResendOtpUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.Mailer) private _mailRepository: IMailRepository,
        @inject(DI_TOKENS.OtpGenerator) private _otpGenerator: IOtpGenerator
    ) { }

    async execute(email: string, context: OtpContext) {
        const user = await this._userRepository.findByEmail(email);
        if (!user) throw new BadRequestError("User not found");

        const otp = this._otpGenerator.generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await this._otpRepository.deleteOtp(user._id, context);
        await this._otpRepository.saveOtp(user._id, email, otp, context);

        await this._mailRepository.sendVerificationEmail(email, otp, context);

        return { success: true, message: "OTP resent successfully", expiresAt };
    }
}