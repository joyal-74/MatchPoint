import nodemailer from 'nodemailer';
import { IMailRepository } from '../../app/providers/IMailRepository';
import { OtpContext } from '../../domain/enums/OtpContext';
import { generateOtpEmailTemplate } from '../utils/EmailTemplate';
import { InternalServerError } from '../../domain/errors/index';

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
            tls: {
                rejectUnauthorized: false 
            }
        });
    }

    async sendVerificationEmail(to: string, otp: string, context: OtpContext = OtpContext.VerifyEmail): Promise<void> {
        const appName = "MatchPoint";
        
        const verifiedSender = process.env.MAIL_FROM || "thorappanbastin77@gmail.com";

        const { subject, html } = generateOtpEmailTemplate(appName, otp, verifiedSender, context);

        try {
            await this.transporter.sendMail({
                from: `"${appName}" <${verifiedSender}>`,
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
