import { Resend } from 'resend';
import { IMailRepository } from '../../app/providers/IMailRepository';
import { OtpContext } from '../../domain/enums/OtpContext';
import { generateOtpEmailTemplate } from '../utils/EmailTemplate';
import { InternalServerError } from '../../domain/errors/index';

export class ResendMailService implements IMailRepository {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendVerificationEmail(to: string, otp: string, context: OtpContext = OtpContext.VerifyEmail): Promise<void> {
        const appName = "MatchPoint";
        const fromEmail = process.env.MAIL_FROM || "onboarding@resend.dev";
        
        const { subject, html } = generateOtpEmailTemplate(appName, otp, fromEmail, context);

        try {
            const { data, error } = await this.resend.emails.send({
                from: `MatchPoint <${fromEmail}>`,
                to: [to],
                subject: subject,
                html: html,
            });

            if (error) {
                console.error("Resend Error:", error);
                throw new InternalServerError("Mail service error");
            }
            
            console.log("✅ Email sent via Resend:", data?.id);
        } catch (err) {
            console.error("Resend execution failed:", err);
            throw new InternalServerError("Unable to send OTP email");
        }
    }
}
