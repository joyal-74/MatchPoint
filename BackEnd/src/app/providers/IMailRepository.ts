import { OtpContext } from "../../domain/enums/OtpContext.js";

export interface IMailRepository {
    sendVerificationEmail(to: string, otp: string, context?: OtpContext ): Promise<void>;
}
