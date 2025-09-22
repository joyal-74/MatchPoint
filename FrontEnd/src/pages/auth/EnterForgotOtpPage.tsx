import React from "react";
import AuthForm from "./AuthForm";
import OtpVerify from "../../components/shared/OtpVerify";
import { useOtpVerify } from "../../hooks/useOtpVerify";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFooter from "../../components/shared/FormFooter";

const EnterOtpPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { expiresAt, email } = location.state || {};

    const { formData, errors, loading, handleFieldChange, handleSubmit, handleResendOtp } = useOtpVerify(email);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.success) {
            toast.success(result.message || "Signup successful!", {
                onClose: () => navigate("/reset-password"),
            });
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    const resendOtp = async () => {
        const result = await handleResendOtp();
        if (!result.success) {
            if (result.errors?.global) {
                toast.error(result.errors.global);
            }
        } else {
            toast.success(result.message);
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
                onSubmit={onSubmit}
                footer={  <FormFooter text="Didn’t receive the OTP?" linkText="Resend" onClick={resendOtp} /> }
            >
                <OtpVerify otp={formData.otp} setOtp={(val) => handleFieldChange("otp", val)} expiresAt={expiresAt} error={errors.otp} />
            </AuthForm>
        </>
    );
};

export default EnterOtpPage;