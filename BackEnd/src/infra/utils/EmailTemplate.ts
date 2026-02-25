import { OtpContext } from "../../domain/enums/OtpContext";

export const generateOtpEmailTemplate = (
    appName: string,
    otp: string,
    supportEmail: string,
    context: OtpContext
): { subject: string; html: string } => {
    // Context-specific content
    let subject = `${appName} - OTP Verification`;
    let purpose = "to verify your email address and activate your account on MatchPoint.";
    let title = "Email Verification";
    let note = "If you did not request this verification, please ignore this email.";

    if (context === OtpContext.ForgotPassword) {
        subject = `${appName} - Password Reset OTP`;
        purpose = "to reset your password for your MatchPoint account.";
        title = "Password Reset Request";
        note = "If you did not request a password reset, please secure your account immediately.";
    }

    // Reusable HTML structure
    const html = `
    <div style="max-width: 600px; padding: 20px; margin: auto; border: 1px solid #ddd; border-radius: 10px; font-family: Arial, sans-serif;">
        <h2 style="color:#2e7dff; text-align:center;">${appName}</h2>
        <h3 style="text-align:center;">${title}</h3>
        <p>Dear User,</p>
        <p>We received a request ${purpose}</p>

        <div style="text-align:center; margin: 30px 0;">
            <p style="font-weight: bold; font-size: 16px;">Your One-Time Password (OTP) is:</p>
            <h2 style="background:#2e7dff; color:#fff; display:inline-block; padding: 12px 25px; border-radius: 8px;">
                ${otp}
            </h2>
        </div>

        <p>This OTP is valid for <b>2 minutes</b>. Please do not share it with anyone for security reasons.</p>

        <p style="margin-top: 20px;">${note}</p>

        <br>
        <p>Thank you,<br><b>The ${appName} Team</b></p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; text-align:center; color:#666;">
            Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a><br>
            &copy; ${new Date().getFullYear()} ${appName}. All Rights Reserved.
        </p>
    </div>
  `;

    return { subject, html };
};
