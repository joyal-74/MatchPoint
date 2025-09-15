import React, { useState } from "react";
import AuthForm from "./AuthForm";
import OtpVerify from "../../components/common/OtpVerify";
import { useOtpVerification } from "../../hooks/useOtpVerify";
import { useLocation, useNavigate } from "react-router-dom";

const EnterAccountOtpPage: React.FC = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const { expiresAt, email } = location.state || {};

    const [errors, setErrors] = useState<{ otp?: string; global?: string }>({});
    const { handleOtpVerify, handleResendOtp, loading, resendLoading } = useOtpVerification(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleOtpVerify(otp);
        if (!result.success) {
            if (typeof result.errors === "string") {
                alert(result.errors);
            } else {
                setErrors(result.errors || {});
            }
        } else {
            if (result.message) {
                alert(result.message);
                navigate("/login");
            }
        }
    };

    const resendOtp = async () => {
        const result = await handleResendOtp();

        if (!result.success) {
            if (typeof result.errors === "string") {
                alert(result.errors);
            } else {
                setErrors(result.errors || {});
            }
        } else {
            if (result.message) {
                alert(result.message);
            }
        }
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

            <OtpVerify otp={otp} setOtp={setOtp} expiresAt={expiresAt} error={errors.otp} />

        </AuthForm>
    );
};

export default EnterAccountOtpPage;