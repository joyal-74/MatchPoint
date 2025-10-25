import React from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import FormFooter from "../../components/shared/FormFooter";
import EmailVerify from "../../components/shared/EmailVerify";
import toast from "react-hot-toast";

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

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,from-neutral-700/20_via-neutral-900_to-neutral-900)] z-0"></div>
                
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-cyan-600/10 rounded-full blur-3xl z-0"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-purple-600/10 rounded-full blur-3xl z-0"></div>

                <div className="relative flex w-[80%] max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-gradient-to-b backdrop-blur-2xl h-160 z-10">
                    <div className="w-full px-12 py-16 flex flex-col justify-between">
                        <div className="text-center">
                            <h1 className="text-[var(--color-text-primary)] text-3xl font-bold tracking-tight">
                                <span className="text-[var(--color-primary)]">M</span>atch
                                <span className="text-[var(--color-primary)]">P</span>oint
                            </h1>
                        </div>
                        <div>
                            <div className="pb-6">
                                <h1 className="text-3xl font-bold text-center text-primary mb-2">
                                    Forgot Password
                                </h1>
                                <p className="text-gray-400 text-center text-sm mb-6">
                                    To reset your password, enter your email address and we’ll send you a one-time verification code.
                                </p>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-6">
                                <EmailVerify
                                    email={formData.email}
                                    setEmail={(val) => handleFieldChange("email", val)}
                                    error={errors.email}
                                />

                                <button
                                    type="submit"
                                    className="w-full btn-primary text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-blue-800/50"
                                >
                                    Send OTP
                                </button>
                            </form>
                        </div>

                        <div className="mt-6 text-center">
                            <FormFooter
                                text="Remembered your password?"
                                linkText="Sign In"
                                linkTo="/login"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ForgotPasswordPage;