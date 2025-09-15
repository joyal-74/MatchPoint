import React, { useState } from "react";
import AuthForm from "./AuthForm";
import OtpVerify from "../../components/common/OtpVerify";
import { useOtpVerification } from "../../hooks/useOtpVerify";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const EnterAccountOtpPage: React.FC = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const { expiresAt, email } = location.state || {};
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<{ otp?: string; global?: string }>({});
    const { handleOtpVerify, handleResendOtp } = useOtpVerification(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        const result = await handleOtpVerify(otp);
        setLoading(false);

        if (result.success) {
            toast.success(result.message || "Signup successful!", {
                onClose: () => { navigate('/login'); },
            });
        } else if (result.errors) {

            if (result.errors.global) toast.error(result.errors.global);

            const fieldErrors = { ...result.errors };
            delete fieldErrors.global;
            setErrors(fieldErrors);
        }
    };

    const resendOtp = async () => {
        const result = await handleResendOtp();

        if (result.success) {
            toast.success(result.message || "verification successful!");
        } else if (result.errors) {

            if (result.errors.global) toast.error(result.errors.global);

            const fieldErrors = { ...result.errors };
            delete fieldErrors.global;
            setErrors(fieldErrors);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingOverlay show={loading} />

            <AuthForm
                title="Enter OTP"
                subtitle="We’ve sent a one-time password (OTP) to your email. Please enter it below to verify your account."
                buttonText={loading ? "Verifying..." : "Verify OTP"}
                onSubmit={handleSubmit}
                footer={
                    <>
                        Didn’t receive the OTP?{" "}
                        <span
                            className={`text-[var(--color-text-accent)] hover:underline`}
                            onClick={resendOtp}
                        >
                            Resend
                        </span>
                    </>
                }
            >

                <OtpVerify otp={otp} setOtp={setOtp} expiresAt={expiresAt} error={errors.otp} />

            </AuthForm>
        </>
    );
};

export default EnterAccountOtpPage;