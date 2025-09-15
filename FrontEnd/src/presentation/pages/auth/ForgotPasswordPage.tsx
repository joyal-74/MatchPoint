import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import EmailVerify from "../../components/common/EmailVerify";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { forgotPassword } = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        const result = await forgotPassword(email);
        setLoading(false);

        if (result.success) {
            toast.success(result.message || "Otp send successful!", {
                onClose: () => {
                    navigate('/otp-verification', {
                        state: { expiresAt: result.expiresAt, email: result.email }
                    });
                },
            });
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
                title="Forgot Password"
                subtitle="Forgot your password? Don’t worry — just enter your email and we’ll send you a one-time password to reset it."
                buttonText="Send OTP"
                onSubmit={handleSubmit}
                footer={
                    <>
                        Remembered your password?{" "}
                        <span
                            className="text-[var(--color-text-accent)] hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </span>
                    </>
                }
            >
                <EmailVerify email={email} setEmail={setEmail} error={errors.email} />

            </AuthForm>
        </>

    );
};

export default ForgotPasswordPage;