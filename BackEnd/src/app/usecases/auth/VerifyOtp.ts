import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers";
import { IVerifyOtpUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository";
import { OtpContext } from "../../../domain/enums/OtpContext";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index";
import { ProfileInitializationService } from "../../../infra/services/ProfileInitializationService";


@injectable()
export class VerifyOtp implements IVerifyOtpUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.ProfileInitializationService) private _profileInitService: ProfileInitializationService
    ) { }

    async execute(email: string, otp: string, context: OtpContext) {
        const otpRecord = await this._otpRepository.findOtpByEmail(email);
        
        if (!otpRecord) {
            throw new NotFoundError("OTP not found or expired");
        }

        if (otpRecord.otp !== otp) {
            throw new BadRequestError("Invalid OTP");
        }

        if (context === OtpContext.VerifyEmail) {
            await this._userRepository.update(otpRecord.userId, { isVerified: true });
            const user = await this._userRepository.findById(otpRecord.userId);

            await this._profileInitService.initialize(user);
        }

        await this._otpRepository.deleteOtp(otpRecord.userId, context);

        return {
            success: true,
            message: context === OtpContext.VerifyEmail 
                ? "Email verified, wallet created, and subscription initialized." 
                : "OTP verified, proceed with password reset",
        };
    }
}
