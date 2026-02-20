import { Otp, OtpResponse } from "../../../../domain/entities/Otp.js";
import { OtpContext } from "../../../../domain/enums/OtpContext.js";
import { IBaseRepository } from "../../IBaseRepository.js";

export interface IOtpRepository extends IBaseRepository<Otp, Otp> {
    saveOtp(id: string, email: string, otp: string, context: OtpContext): Promise<Otp>;
    findOtpByEmail(email: string): Promise<OtpResponse | null>;
    deleteOtp(userId: string, context: OtpContext): Promise<void>;
}