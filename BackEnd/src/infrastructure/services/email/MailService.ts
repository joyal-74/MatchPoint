import nodemailer from 'nodemailer';

export class MailService {
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

    async sendVerificationEmail(to: string, otp: string): Promise<void> {
        const mailOptions = {
            from: `"MatchPoint" <${process.env.SMTP_USER}>`,
            to,
            subject: "Email Verification - MatchPoint",
            html: `
                <h2>Email Verification</h2>
                <p>Use the following OTP to verify your account:</p>
                <h3>${otp}</h3>
                <p>This OTP will expire in 10 minutes.</p>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}