import { IMailRepository } from "app/providers/IMailRepository";
import { OtpContext } from "domain/enums/OtpContext";
import { InternalServerError } from "domain/errors";
import { generateOtpEmailTemplate } from "infra/utils/EmailTemplate";
import nodemailer from 'nodemailer';

export class NodeMailerService implements IMailRepository {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationEmail(to: string, otp: string, context: OtpContext = OtpContext.VerifyEmail): Promise<void> {
        const appName = "MatchPoint";
        const supportEmail = process.env.SMTP_USER || "support@matchpoint.com";

        const { subject, html } = generateOtpEmailTemplate(appName, otp, supportEmail, context);

        try {
            await this.transporter.sendMail({
                from: `"${appName}" <${supportEmail}>`,
                to,
                subject,
                html,
            });
        } catch (err) {
            console.error("Email sending failed:", err);
            throw new InternalServerError("Unable to send OTP email");
        }
    }
}