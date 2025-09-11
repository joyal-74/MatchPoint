import React, { useState } from "react";
import AuthForm from "./AuthForm";

const EnterOtpPage: React.FC = () => {
    const [otp, setOtp] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Entered OTP:", otp);
        // Here you’d verify OTP with backend
    };

    const resendOtp = () => {
        // resend otp function
    }

    return (
        <AuthForm
            title="Enter OTP"
            subtitle="We’ve sent a one-time password (OTP) to your email. Please enter it below to verify your account."
            buttonText="Verify OTP"
            onSubmit={handleSubmit}
            footer={
                <>
                    Didn’t receive the OTP?{" "} <span className="text-[var(--color-text-accent)] hover:underline" onClick={()=> resendOtp()}>Resend</span>
                </>
            }
        >

            <div className="flex flex-col text-sm max-w-xs w-full mx-auto">
                <label htmlFor="otp" className="text-sm text-center mb-1">
                    One-Time Password
                </label>
                <input
                    id="otp"
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 rounded-md tracking-widest text-center text-lg font-bold bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
                <h1 className="text-center text-sm text-[var(--color-error-text)]">0:00</h1>
            </div>
        </AuthForm>
    );
};

export default EnterOtpPage;