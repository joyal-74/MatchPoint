import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { verifyOtp, resendOtp } from "../store/slices/auth/authThunks";
import { useNavigate, useLocation } from "react-router-dom";

type ValidationErrors = { otp?: string; global?: string };

type OtpResult =
    | { success: true }
    | { success: false; errors: ValidationErrors };

export const useOtpVerification = (redirectTo: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const email = (location.state as { email?: string })?.email;

    const validateForm = (otp: string): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!otp) errors.otp = "OTP is required";
        else if (otp.length !== 6) errors.otp = "OTP must be 6 digits";
        else if (!/^\d+$/.test(otp)) errors.otp = "OTP must contain only numbers";
        return errors;
    };

    const handleOtpVerify = async (otp: string): Promise<OtpResult> => {
        const errors = validateForm(otp);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        if (!email) {
            return { success: false, errors: { global: "Email is missing" } };
        }

        setLoading(true);
        try {
            const resultAction = await dispatch(verifyOtp({ email, otp }));
            if (verifyOtp.fulfilled.match(resultAction)) {
                navigate(redirectTo, { state: { email } });
                return { success: true };
            } else {
                return {
                    success: false,
                    errors: {
                        global: (resultAction.payload as string) || "OTP verification failed",
                    },
                };
            }
        } catch {
            return { success: false, errors: { global: "Something went wrong" } };
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async (): Promise<OtpResult> => {
        if (!email) {
            return { success: false, errors: { global: "Email is missing" } };
        }

        setResendLoading(true);
        try {
            const resultAction = await dispatch(resendOtp(email));
            if (resendOtp.fulfilled.match(resultAction)) {
                return { success: true };
            } else {
                return {
                    success: false,
                    errors: { global: (resultAction.payload as string) || "Resend failed" },
                };
            }
        } catch {
            return { success: false, errors: { global: "Something went wrong" } };
        } finally {
            setResendLoading(false);
        }
    };

    return { handleOtpVerify, handleResendOtp, loading, resendLoading };
};