import React, { useState } from "react";
import AuthForm from "./AuthForm";
import OtpVerify from "../../components/common/OtpVerify";
import { useOtpVerification } from "../../hooks/useOtpVerify";

const EnterAccountOtpPage: React.FC = () => {
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState<{ otp?: string; global?: string }>({});
    const { handleOtpVerify, handleResendOtp, loading, resendLoading } = useOtpVerification('/login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleOtpVerify(otp);
        if (!result.success) setErrors(result.errors);
    };

    const resendOtp = async () => {
        const result = await handleResendOtp();
        if (!result.success) setErrors(result.errors);
    };

    return (
        <AuthForm
            title="Enter OTP"
            subtitle="We’ve sent a one-time password (OTP) to your email. Please enter it below to verify your account."
            buttonText={loading ? "Verifying..." : "Verify OTP"}
            onSubmit={handleSubmit}
            footer={
                <>
                    Didn’t receive the OTP?{" "}
                    <span
                        className={`text-[var(--color-text-accent)] hover:underline ${resendLoading && "opacity-50 pointer-events-none"}`}
                        onClick={!resendLoading ? resendOtp : undefined}
                    >
                        {resendLoading ? "Resending..." : "Resend"}
                    </span>
                </>
            }
        >

            <OtpVerify otp={otp} setOtp={setOtp} />

            {errors.otp && <p className="text-red-500 text-center text-sm mt-2">{errors.otp}</p>}
            {errors.global && <p className="text-red-500 text-center text-sm mt-2">{errors.global}</p>}

        </AuthForm>
    );
};

export default EnterAccountOtpPage;