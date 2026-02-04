import { Otp } from "../../../../domain/entities/Otp.js";
import { OtpContext } from "../../../../domain/enums/OtpContext.js";

export interface IOtpRepository {
    saveOtp(id: string, email: string, otp: string, context : OtpContext): Promise<Otp>;
    findOtpById(id: string): Promise<Otp | null>;
    findOtpByEmail(email: string): Promise<Otp | null>;
    deleteOtp(userId: string, context : OtpContext): Promise<void>;
}
