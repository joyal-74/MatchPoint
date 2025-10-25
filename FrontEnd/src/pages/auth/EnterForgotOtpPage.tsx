import React, { useEffect } from "react";
import OtpVerify from "../../components/shared/OtpVerify";
import { useOtpVerify } from "../../hooks/useOtpVerify";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFooter from "../../components/shared/FormFooter";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setResetData } from "../../features/auth";

const EnterForgotOtpPage: React.FC = () => {
    const navigate = useNavigate();
    const { expiresAt: stateExpiresAt, resetEmail } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

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

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("otpEmail");
        const storedExpiresAt = sessionStorage.getItem("otpExpiresAt");

        if (storedEmail && storedExpiresAt) {
            dispatch(setResetData({ email: storedEmail, expiresAt: storedExpiresAt }));
        } else if (!storedEmail || !storedExpiresAt) {
            navigate("/forgot-password", { replace: true });
        }
    }, [dispatch, navigate]);

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
            <LoadingOverlay show={loading} theme="gradient"/>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700/20 via-neutral-900 to-neutral-900"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-cyan-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>

                <div className="relative flex w-[80%] max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-gradient-to-b backdrop-blur-2xl h-160">
                    <div className="w-full px-12 py-16 flex flex-col justify-between">
                        <div className="text-center">
                            <h1 className="text-[var(--color-text-primary)] text-3xl font-bold tracking-tight">
                                <span className="text-[var(--color-primary)]">M</span>atch
                                <span className="text-[var(--color-primary)]">P</span>oint
                            </h1>
                        </div>
                        <div>
                            <div className="pb-6">
                                <h1 className="text-3xl font-bold text-center text-primary mb-2">Verify with OTP</h1>
                                <p className="text-gray-400 text-center text-sm mb-6">
                                    We've sent a one-time password (OTP) to your email. Please enter it below to verify your account.
                                </p>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-6">
                                <OtpVerify
                                    otp={formData.otp}
                                    setOtp={(val) => handleFieldChange("otp", val)}
                                    expiresAt={stateExpiresAt || undefined}
                                    error={errors.otp}
                                />

                                <button
                                    type="submit"
                                    className="w-full btn-primary text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-blue-800/50"
                                >
                                    Verify OTP
                                </button>
                                <FormFooter
                                    text="Didn't receive the OTP?"
                                    linkText="Resend"
                                    onClick={resendOtp}
                                    expiresAt={stateExpiresAt || undefined}
                                    disabled={!isOtpExpired}
                                />
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

export default EnterForgotOtpPage;