import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import FormFooter from "../../components/shared/FormFooter";
import EmailVerify from "../../components/shared/EmailVerify";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleSubmit, handleFieldChange, errors, loading, formData } = useForgotPassword();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        
        if (result.success) {
            toast.success(result.message || "Otp sent successfully!", {
                onClose: () =>
                    navigate("/otp-verification", {
                        state: { expiresAt: result.expiresAt, email: result.email },
                    }),
            });
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingOverlay show={loading} />
            <AuthForm
                title="Forgot Password"
                subtitle="Forgot your password? Don’t worry — just enter your email and we’ll send you a one-time password to reset it."
                buttonText="Send OTP"
                onSubmit={onSubmit}
                footer={
                    <FormFooter
                        text="Remembered your password?"
                        linkText="SignIn"
                        linkTo="/login"
                    />
                }
            >
                <EmailVerify
                    email={formData.email}
                    setEmail={(val) => handleFieldChange("email", val)}
                    error={errors.email}
                />
            </AuthForm>
        </>
    );
};

export default ForgotPasswordPage;