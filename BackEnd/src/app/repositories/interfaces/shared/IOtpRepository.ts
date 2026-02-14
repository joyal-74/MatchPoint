import { Otp } from "../../../../domain/entities/Otp.js";
import { OtpContext } from "../../../../domain/enums/OtpContext.js";
import { IBaseRepository } from "../../IBaseRepository.js";

export interface IOtpRepository extends IBaseRepository<Otp, Otp> {
    saveOtp(id: string, email: string, otp: string, context: OtpContext): Promise<Otp>;

    deleteOtp(userId: string, context: OtpContext): Promise<void>;
}