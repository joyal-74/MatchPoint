import { injectable, inject } from "tsyringe";
import { DI_TOKENS } from "../../../domain/constants/Identifiers.js";
import { IVerifyOtpUseCase } from "../../repositories/interfaces/auth/IAuthenticationUseCase.js";
import { IUserRepository } from "../../repositories/interfaces/shared/IUserRepository.js";
import { IOtpRepository } from "../../repositories/interfaces/shared/IOtpRepository.js";
import { IWalletRepository } from "../../repositories/interfaces/shared/IWalletRepository.js";
import { ISubscriptionRepository } from "../../repositories/interfaces/shared/ISubscriptionRepository.js";
import { OtpContext } from "../../../domain/enums/OtpContext.js";
import { BadRequestError, NotFoundError } from "../../../domain/errors/index.js";


@injectable()
export class VerifyOtp implements IVerifyOtpUseCase {
    constructor(
        @inject(DI_TOKENS.UserRepository) private _userRepository: IUserRepository,
        @inject(DI_TOKENS.OtpRepository) private _otpRepository: IOtpRepository,
        @inject(DI_TOKENS.WalletRepository) private _walletRepository: IWalletRepository,
        @inject(DI_TOKENS.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository,
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

            await this._walletRepository.create({
                ownerId: otpRecord.userId,
                ownerType: 'USER',
                balance: 0,
                currency: 'INR',
                isFrozen : false
            });


            await this._subscriptionRepository.create({
                userId: otpRecord.userId,
                level: 'Free',
                status: 'active',
            });
        }

        // Clean up the OTP
        await this._otpRepository.deleteOtp(otpRecord.userId, context);

        return {
            success: true,
            message: context === OtpContext.VerifyEmail 
                ? "Email verified, wallet created, and subscription initialized." 
                : "OTP verified, proceed with password reset",
        };
    }
}
