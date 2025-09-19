import { Otp } from "domain/entities/Otp";

export interface IOtpRepository {
    saveOtp(id: string, email: string, otp: string, context : string): Promise<Otp>;
    findOtpById(id: string): Promise<Otp | null>;
    findOtpByEmail(email: string): Promise<Otp | null>;
    deleteOtp(userId: string): Promise<void>;
}