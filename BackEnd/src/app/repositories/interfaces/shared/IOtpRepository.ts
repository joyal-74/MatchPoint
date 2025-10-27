import { Otp } from "domain/entities/Otp";
import { OtpContext } from "domain/enums/OtpContext";

export interface IOtpRepository {
    saveOtp(id: string, email: string, otp: string, context : OtpContext): Promise<Otp>;
    findOtpById(id: string): Promise<Otp | null>;
    findOtpByEmail(email: string): Promise<Otp | null>;
    deleteOtp(userId: string, context : OtpContext): Promise<void>;
}