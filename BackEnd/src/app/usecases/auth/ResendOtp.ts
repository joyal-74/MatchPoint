import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IResendOtpUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository.js";
import { IMailRepository } from "../../providers/IMailRepository.js";
import { IOtpGenerator } from "../../providers/IOtpGenerator.js";
import { OtpContext } from "../../../domain/enums/OtpContext.js";
import { BadRequestError } from "../../../domain/errors/index.js";


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
