import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setResetData } from "../../features/auth";
import { useOtpVerify } from "../../hooks/useOtpVerify";

import OtpVerify from "../../components/shared/OtpVerify";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFooter from "../../components/shared/FormFooter";
import AuthForm from "../../components/shared/AuthForm";

const EnterForgotOtpPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { expiresAt: stateExpiresAt, resetEmail } = useAppSelector(state => state.auth);

    const email = resetEmail || sessionStorage.getItem("otpEmail") || "";

    const {
        formData,
        errors,
        loading,
        handleFieldChange,
        handleSubmit,
        handleResendOtp,
        isOtpExpired
    } = useOtpVerify(email, 'forgot_password', stateExpiresAt ?? undefined);

    // Redirect if no email found in session
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("otpEmail");
        const storedExpiresAt = sessionStorage.getItem("otpExpiresAt");

        if (storedEmail && storedExpiresAt) {
            dispatch(setResetData({ email: storedEmail, expiresAt: storedExpiresAt }));
        } else if (!storedEmail && !resetEmail) {
            navigate("/forgot-password", { replace: true });
        }
    }, [dispatch, navigate, resetEmail]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.success) {
            toast.success(result.message || "Verification successful!");
            navigate("/reset-password");
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
            toast.success(result.message || 'OTP sent successfully');
            sessionStorage.setItem("otpExpiresAt", result.expiresAt!);
            dispatch(setResetData({ email: email || resetEmail, expiresAt: result.expiresAt! }));
        }
    };

    return (
        <>
            <LoadingOverlay show={loading} />
            
            <AuthForm
                mainHeading="Verify Code"
                subHeading="Check your email"
                subtitle={`We've sent a one-time password to ${email}. Please enter it below.`}
                buttonText="Verify & Continue"
                onSubmit={onSubmit}
                showSocialButtons={false} // No social login needed for OTP
                footer={
                    <div className="flex flex-col gap-4 text-center mt-2">
                        {/* Resend Logic */}
                        <FormFooter
                            text="Didn't receive the OTP?"
                            linkText="Resend Code"
                            onClick={resendOtp}
                            expiresAt={stateExpiresAt || undefined}
                            disabled={!isOtpExpired}
                        />
                        
                        {/* Back to Login */}
                        <FormFooter
                            text="Remember your password?"
                            linkText="Back to Login"
                            linkTo="/login"
                        />
                    </div>
                }
            >
                <div className="py-4">
                    <OtpVerify
                        otp={formData.otp}
                        setOtp={(val) => handleFieldChange("otp", val)}
                        expiresAt={stateExpiresAt || undefined}
                        error={errors.otp}
                    />
                </div>
            </AuthForm>
        </>
    );
};

export default EnterForgotOtpPage;