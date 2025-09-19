import { IMailRepository } from 'app/providers/IMailRepository';
import { InternalServerError } from 'domain/errors';
import nodemailer from 'nodemailer';
import { OtpContext } from 'domain/enums/OtpContext'; 

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
        let subject = "OTP Verification - MatchPoint";
        let html = `
            <h2>OTP Verification</h2>
            <p>Use the following OTP:</p>
            <h3>${otp}</h3>
            <p>This OTP will expire in 2 minutes.</p>
        `;

        if (context === OtpContext.ForgotPassword) {
            subject = "Password Reset OTP - MatchPoint";
            html = `
                <h2>Password Reset</h2>
                <p>Use this OTP to reset your password:</p>
                <h3>${otp}</h3>
                <p>This OTP will expire in 2 minutes.</p>
            `;
        }

        try {
            await this.transporter.sendMail({
                from: `"MatchPoint" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });
        } catch (err) {
            console.error(err);
            throw new InternalServerError("Unable to send OTP email");
        }
    }
}
