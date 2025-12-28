import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForgotPassword } from "../../hooks/useForgotPassword";

import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFooter from "../../components/shared/FormFooter";
import EmailVerify from "../../components/shared/EmailVerify";
import AuthForm from "../../components/shared/AuthForm";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleSubmit, handleFieldChange, errors, loading, formData } = useForgotPassword();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();

        if (result.success) {
            toast.success(result.message || "OTP sent successfully!");
            sessionStorage.setItem("otpEmail", result.email!);
            sessionStorage.setItem("otpExpiresAt", result.expiresAt!);
            
            navigate("/otp-verification");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <LoadingOverlay show={loading} />

            <AuthForm
                mainHeading="Forgot Password"
                subtitle="To reset your password, enter your email address and we’ll send you a one-time verification code."
                buttonText="Send OTP"
                onSubmit={onSubmit}
                showSocialButtons={false}
                footer={
                    <div className="mt-4 text-center">
                        <FormFooter
                            text="Remembered your password?"
                            linkText="Sign In"
                            linkTo="/login"
                        />
                    </div>
                }
            >
                <div className="py-2">
                    <EmailVerify
                        email={formData.email}
                        setEmail={(val) => handleFieldChange("email", val)}
                        error={errors.email}
                    />
                </div>
            </AuthForm>
        </>
    );
};

export default ForgotPasswordPage;