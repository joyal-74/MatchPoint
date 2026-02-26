import { Otp, OtpResponse } from "../../../../domain/entities/Otp";
import { OtpContext } from "../../../../domain/enums/OtpContext";
import { IBaseRepository } from "../../IBaseRepository";

export interface IOtpRepository extends IBaseRepository<Otp, Otp> {
    saveOtp(id: string, email: string, otp: string, context: OtpContext): Promise<Otp>;
    findOtpByEmail(email: string): Promise<OtpResponse | null>;
    deleteOtp(userId: string, context: OtpContext): Promise<void>;
}
