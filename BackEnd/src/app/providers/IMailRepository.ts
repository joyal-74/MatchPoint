import { OtpContext } from "domain/enums/OtpContext";

export interface IMailRepository {
    sendVerificationEmail(to: string, otp: string, context?: OtpContext ): Promise<void>;
}